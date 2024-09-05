import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema with Yup
const schema = yup.object().shape({
  firstName: yup.string().matches(/^[A-Za-z]+$/, 'Only letters are allowed').required('First name is required'),
  lastName: yup.string().matches(/^[A-Za-z]+$/, 'Only letters are allowed').required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
});

Modal.setAppElement('#root');

function CustomerForm() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal for errors
  const [modalMessage, setModalMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: customer,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      fetchCustomer();
    } else {
      setLoading(false); // No customer to fetch if we're adding a new one
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`https://customer-management-task.onrender.com/api/customers/${id}`);
      setCustomer(response.data);
      setValue('firstName', response.data.firstName);
      setValue('lastName', response.data.lastName);
      setValue('email', response.data.email);
      setValue('phone', response.data.phone);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching customer data.');
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (id) {
        const res = await axios.put(`https://customer-management-task.onrender.com/api/customers/${id}`, data);
        toast.success('Customer updated successfully!');
        console.log(res)
      } else {
        // Check if the email already exists
        // const emailCheckResponse = await axios.post('https://customer-management-task.onrender.com/api/customers/check-email', { email: data.email });
        if (res.data.message === "Email is already registered") {
          setModalMessage('This email is already registered.');
          setModalIsOpen(true); // Open the modal
          return;
        }

        await axios.post('https://customer-management-task.onrender.com/api/customers', data);
        toast.success('Customer added successfully!');
      }
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setModalMessage(error.response.data.message || 'Error saving customer.');
        setModalIsOpen(true);
      } else {
        toast.error('Error saving customer.');
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-5">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{id ? 'Update Customer' : 'Add Customer'}</h2>

            {/* First Name Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className={`w-full p-3 border rounded-lg ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className={`w-full p-3 border rounded-lg ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full p-3 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full p-3 border rounded-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {id ? 'Update Customer' : 'Add Customer'}
            </button>

            {/* Back to List Link */}
            <Link to="/" className="block text-center text-blue-500 mt-4 hover:underline">
              Back to Customer List
            </Link>
          </form>
        )}
      </div>

      {/* Error Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal">
        <h2 className="text-lg font-bold">Error</h2>
        <p>{modalMessage}</p>
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default CustomerForm;
