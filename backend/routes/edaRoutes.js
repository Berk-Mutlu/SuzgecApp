const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/redisMiddleware');
const { 
  getLists, getList, createList, updateList, deleteList, 
  getListItems, addListItem, removeListItem,
  createReview, getProductReviews, updateReview, deleteReview
} = require('../controllers/edaController');

const listsRouter = express.Router();

listsRouter.use(protect);

listsRouter.route('/')
  .get(getLists)
  .post(createList);

listsRouter.route('/:listId')
  .get(getList)
  .put(updateList)
  .delete(deleteList);

listsRouter.route('/:listId/items')
  .get(getListItems)
  .post(addListItem);

listsRouter.route('/:listId/items/:itemId')
  .delete(removeListItem);

const reviewsRouter = express.Router();
// Redis: Ürün yorumlarını önbellekle (TTL: 3 dakika)
reviewsRouter.get('/:productId', cacheMiddleware(180), getProductReviews);
reviewsRouter.post('/:productId', protect, createReview);
reviewsRouter.put('/:reviewId', protect, updateReview);
reviewsRouter.delete('/:reviewId', protect, deleteReview);

module.exports = { listsRouter, reviewsRouter };
