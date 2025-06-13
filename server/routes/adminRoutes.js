import express from 'express';
import { fetchAllOrders } from '../controllers/adminController.js';

const router = express.Router();


router.get('/orders', fetchAllOrders);

export default router;
