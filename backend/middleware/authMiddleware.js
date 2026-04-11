const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'suzgec_secret_key');
      // Token payload'ından user ID al — DB sorgusu yok
      req.user = { _id: decoded.id };
      return next();
    } catch (error) {
      return res.status(401).json({ description: 'Yetkisiz erişim', message: 'Token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ description: 'Yetkisiz erişim', message: 'No token provided' });
  }
};

module.exports = { protect };
