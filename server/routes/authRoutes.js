import express from "express";
import { registerUser, loginUser, loginAdmin, getUserCoinsByEmail, getAllUsers, getTotalUsers } from "../controllers/userController.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// login admin
router.post("/admin/login", loginAdmin);

// Fetch wallet coins by email
router.get("/coins/:email", getUserCoinsByEmail);

// fetch users
router.get("/users", getAllUsers);

// Fetch total number of users
router.get("/total-users", getTotalUsers);


export default router;