import express from 'express';
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.post('/:id/addresses', customerController.addAddress);
router.put('/:customerId/addresses/:addressId', customerController.updateAddress);
router.delete('/:customerId/addresses/:addressId', customerController.deleteAddress);

export default router;