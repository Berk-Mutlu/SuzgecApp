const express = require('express');
const { protect } = require('../middleware/authMiddleware');
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

const usersRouter = express.Router();
usersRouter.get('/history/searches', protect, getSearchHistory);
usersRouter.route('/:userId')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

const productsRouter = express.Router();
productsRouter.get('/search', protect, searchProducts);
productsRouter.get('/search/public', searchProducts);
productsRouter.get('/:productId', getProductDetail);
productsRouter.get('/:productId/sellers', getProductSellers);
productsRouter.post('/:productId/resolve-url', resolveAdUrl);

const comparisonsRouter = express.Router();
comparisonsRouter.route('/')
  .get(protect, getComparison);
comparisonsRouter.route('/items').post(protect, addToComparison);
comparisonsRouter.route('/items/:itemId').delete(protect, removeFromComparison);

module.exports = { authRouter, usersRouter, productsRouter, comparisonsRouter };
