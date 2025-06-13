import admin from '../config/firebaseConfig.js';

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error });
  }
};

export default verifyToken;
