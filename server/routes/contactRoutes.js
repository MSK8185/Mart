import express from "express";
import { submitContactForm, getAllContacts, deleteContact } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", submitContactForm);
router.get('/getContacts', getAllContacts); 
router.delete('/deleteContact/:id', deleteContact);


export default router;
