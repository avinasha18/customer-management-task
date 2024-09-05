import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchCustomers = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await axios.get(`${API_URL}/customers?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};


export const fetchCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    await axios.delete(`${API_URL}/customers/${id}`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const addAddress = async (customerId, addressData) => {
  try {
    const response = await axios.post(`${API_URL}/customers/${customerId}/addresses`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

export const deleteAddress = async (customerId, addressId) => {
  try {
    await axios.delete(`${API_URL}/customers/${customerId}/addresses/${addressId}`);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};