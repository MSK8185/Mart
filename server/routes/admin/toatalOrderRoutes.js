import express from "express";
import { getTotalOrders } from "../../controllers/admin/totalOrdersController.js"; // Ensure correct path

const router = express.Router();


router.get("/total-orders", getTotalOrders);



export default router;
