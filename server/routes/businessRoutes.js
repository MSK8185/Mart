import express from 'express';
import upload from '../config/multer.js';
import { createBusinessInfo,  getAllBusinessInfos,
  updateBusinessStatus, getBusinessInfoByEmail } from '../controllers/businessController.js';

const router = express.Router();

router.post('/',
  upload.fields([
    { name: 'panFile', maxCount: 1 },
    { name: 'aadharFile', maxCount: 1 },
  ]),
  createBusinessInfo
);


router.get('/', getAllBusinessInfos); 
router.put('/:id/status', updateBusinessStatus);

router.get('/getBusinessInfo/:userEmail', getBusinessInfoByEmail)

export default router;
