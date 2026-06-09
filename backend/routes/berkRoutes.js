const express = require('express');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/redisMiddleware');
const { blacklistToken } = require('../config/redisClient');
const { 
  registerUser, 
  loginUser,
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  getProductDetail, 
  addToComparison, 
  removeFromComparison,
  getComparison,
  searchProducts,
  getSearchHistory,
  getProductSellers,
  resolveAdUrl
} = require('../controllers/berkController');

const authRouter = express.Router();
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

// Logout endpoint — JWT token'ı Redis kara listesine ekler
authRouter.post('/logout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    
    // Token'ın kalan süresini hesapla
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp ? decoded.exp - now : 86400; // Varsayılan 1 gün
    
    // Token'ı Redis kara listesine ekle
    await blacklistToken(token, expiresIn);
    
    res.status(200).json({ 
      success: true, 
      message: 'Oturum başarıyla kapatıldı. Token kara listeye eklendi.' 
    });
  } catch (error) {
    console.error('Logout hatası:', error);
    res.status(500).json({ success: false, error: 'Çıkış işlemi sırasında hata oluştu' });
  }
});

const usersRouter = express.Router();
usersRouter.get('/history/searches', protect, getSearchHistory);
usersRouter.route('/:userId')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

const productsRouter = express.Router();
// Ürün arama — Redis önbellek ile (TTL: 5 dakika)
productsRouter.get('/search', protect, cacheMiddleware(300), searchProducts);
productsRouter.get('/search/public', cacheMiddleware(300), searchProducts);
// Ürün detay — Redis önbellek ile (TTL: 10 dakika)
productsRouter.get('/:productId', cacheMiddleware(600), getProductDetail);
productsRouter.get('/:productId/sellers', cacheMiddleware(600), getProductSellers);
productsRouter.post('/:productId/resolve-url', resolveAdUrl);

const comparisonsRouter = express.Router();
comparisonsRouter.route('/')
  .get(protect, getComparison);
comparisonsRouter.route('/items').post(protect, addToComparison);
comparisonsRouter.route('/items/:itemId').delete(protect, removeFromComparison);

module.exports = { authRouter, usersRouter, productsRouter, comparisonsRouter };
