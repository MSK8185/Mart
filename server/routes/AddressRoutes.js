import { addAddress, fetchAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/AddressController.js";
import express from 'express';

const router = express.Router();

router.post('/addAddress', addAddress);

router.get('/fetchAddress', fetchAddress);

router.put('/updateAddress/:id', updateAddress);

router.delete('/deleteAddress/:id', deleteAddress);

router.post('/set-default', setDefaultAddress);

export default router;