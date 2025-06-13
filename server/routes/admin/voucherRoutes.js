import express from "express";
import { addVoucher, getAllVouchers, deleteVoucher, toggleVoucher, validateVoucher, useVoucher, editVoucher } from "../../controllers/admin/voucherController.js";

const router = express.Router();

router.post('/addVoucher', addVoucher);

router.get('/getAllVouchers', getAllVouchers);

router.delete('/deleteVoucher/:id', deleteVoucher);

router.put('/toggleVoucher/:id', toggleVoucher);

router.post('/validateVoucher', validateVoucher);

router.post('/use', useVoucher);

router.put('/editVoucher/:id', editVoucher);

export default router;