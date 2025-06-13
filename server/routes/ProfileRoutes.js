import express from "express";
import { 
  getProfileInformation, 
  createProfileInformation, 
  updateProfileInformation, 
  deleteProfileInformation 
} from "../controllers/ProfileController.js";

const router = express.Router();

router.get("/:email", getProfileInformation);

// CREATE profile info (POST /api/profile/create)
router.post("/create", createProfileInformation);

// UPDATE profile info (PUT /api/profile/update)
router.put("/update", updateProfileInformation);

// DELETE profile info (DELETE /api/profile/delete)
router.delete("/delete", deleteProfileInformation);

export default router;
