import Customer from '../models/CustomerModel.js';
import { sendWelcomeEmail } from '../services/emailService.js';


export const createCustomer = async (req, res) => {
    try {
      // Check if email already exists
      const existingCustomer = await Customer.findOne({ email: req.body.email });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Create a new customer
      const newCustomer = new Customer(req.body);
      
      // Send welcome email
      await sendWelcomeEmail(newCustomer);
      
      // Save customer to database
      await newCustomer.save();
      
      return res.status(201).json(newCustomer);
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ message: error.message });
    }
  };

export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Customer.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.addresses.push(req.body);
    await customer.save();

    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const address = customer.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    Object.assign(address, req.body);
    await customer.save();

    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.customerId);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
  
      const addressIndex = customer.addresses.findIndex(
        (address) => address._id.toString() === req.params.addressId
      );
  
      if (addressIndex === -1) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      customer.addresses.splice(addressIndex, 1);
      await customer.save();
  
      res.json(customer);
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(400).json({ message: error.message });
    }
  };