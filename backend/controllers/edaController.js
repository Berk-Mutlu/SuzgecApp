const List = require('../models/List');
const Review = require('../models/Review');
const { sendNotification } = require('../services/notificationProducer');

exports.getLists = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Tek sorgu: listeler + item sayısı + preview items
    const lists = await List.aggregate([
      { $match: { user: userId } },
      {
        $addFields: {
          itemCount: { $size: { $ifNull: ['$items', []] } },
          previewItemIds: { $slice: ['$items', 4] }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'previewItemIds',
          foreignField: '_id',
          as: 'previewItems',
          pipeline: [
            { $project: { imageUrl: 1, image: 1, name: 1 } }
          ]
        }
      },
      {
        $project: {
          name: 1, color: 1, icon: 1, itemCount: 1,
          previewItems: {
            $map: {
              input: '$previewItems',
              as: 'item',
              in: {
                imageUrl: { $ifNull: ['$$item.imageUrl', '$$item.image'] },
                name: '$$item.name'
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({ success: true, data: lists });
  } catch (error) { 
    res.status(400).json({ success: false, error: error.message }); 
  }
};

exports.getList = async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, user: req.user._id }).populate('items');
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    res.status(200).json({ success: true, data: list });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createList = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const list = await List.create({ 
      user: req.user._id, 
      name, 
      color: color || '#7c3aed', 
      icon: icon !== undefined && icon !== null ? icon : '📋',
      items: [] 
    });
    res.status(201).json({ success: true, data: list, message: 'Liste oluşturuldu' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateList = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const updateData = { name, color };
    if (icon !== undefined && icon !== null) updateData.icon = icon;
    else if (icon === '') updateData.icon = '';
    const list = await List.findOneAndUpdate(
      { _id: req.params.listId, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    res.status(200).json({ success: true, data: list, message: 'Güncellendi' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.listId, user: req.user._id });
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.getListItems = async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, user: req.user._id }).populate('items');
    if (!list) return res.status(404).json({ message: 'List not found' });
    const formattedItems = list.items.map(item => ({
      id: item._id,
      name: item.name,
      price: item.price
    }));
    res.status(200).json(formattedItems);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.addListItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const list = await List.findOne({ _id: req.params.listId, user: req.user._id });
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    if (!list.items.includes(productId)) {
      list.items.push(productId);
      await list.save();
    }
    res.status(201).json({ success: true, message: 'Ürün eklendi' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.removeListItem = async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, user: req.user._id });
    if (!list) return res.status(404).json({ message: 'List not found' });
    list.items = list.items.filter(item => item.toString() !== req.params.itemId);
    await list.save();
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    
    const existingReview = await Review.findOne({ productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Bu ürüne zaten bir değerlendirme bıraktınız.' });
    }

    const review = await Review.create({
      user: req.user._id,
      productId,
      rating,
      comment
    });

    // RabbitMQ: Yorum eklendi bildirimi gönder
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    await sendNotification({
      userId: req.user._id,
      type: 'system',
      title: 'Yorum Eklendi ✍️',
      message: `"${product ? product.name : 'Ürün'}" için ${rating} yıldızlı değerlendirmeniz başarıyla eklendi. Teşekkürler!`,
      productId: productId,
      productName: product ? product.name : null,
    });

    res.status(201).json({ success: true, data: review, message: 'Değerlendirmeniz başarıyla eklendi.' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.reviewId, user: req.user._id });

    if (!review) return res.status(404).json({ success: false, message: 'Yorum bulunamadı veya yetkiniz yok.' });

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    res.status(200).json({ success: true, data: review, message: 'Değerlendirmeniz güncellendi.' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user._id });

    if (!review) return res.status(404).json({ success: false, message: 'Yorum bulunamadı veya yetkiniz yok.' });
    res.status(204).send();
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
