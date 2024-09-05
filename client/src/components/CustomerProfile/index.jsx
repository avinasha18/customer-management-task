import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddressForm from '../AddressForm';
import { handleError } from '../../utils/errorHandler';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Necessary for accessibility

function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://customer-management-task.onrender.com/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      handleError(error);
      toast.error('Error fetching customer data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (address) => {
    try {
      await axios.post(`https://customer-management-task.onrender.com/api/customers/${id}/addresses`, address);
      fetchCustomer();
      setShowAddressForm(false);
      toast.success('Address added successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Error adding address.');
    }
  };

  const openDeleteModal = (addressId) => {
    setAddressToDelete(addressId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleDeleteAddress = async () => {
    try {
      await axios.delete(`https://customer-management-task.onrender.com/api/customers/${id}/addresses/${addressToDelete}`);
      fetchCustomer();
      toast.success('Address deleted successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Error deleting address.');
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton height={40} count={1} />
        <Skeleton height={20} count={3} style={{ marginTop: '10px' }} />
        <Skeleton height={20} width={200} style={{ marginTop: '20px' }} />
        <Skeleton height={20} width={100} style={{ marginTop: '20px' }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          Customer Profile
          <FaCheckCircle className="ml-2 text-green-500" />
        </h2>
        <div className="mb-4">
          <p className="font-semibold text-gray-700">
            <strong>Name: </strong> {customer.firstName} {customer.lastName}
          </p>
          <p className="font-semibold text-gray-700">
            <strong>Email: </strong> {customer.email}
          </p>
          <p className="font-semibold text-gray-700">
            <strong>Phone: </strong> {customer.phone}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">Addresses</h3>
          {customer.addresses.length > 0 ? (
            customer.addresses.map((address, index) => (
              <div key={address._id} className="border p-4 mb-2 rounded bg-gray-50">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>{address.isPrimary ? '(Primary)' : ''}</p>
                <button
                  onClick={() => openDeleteModal(address._id)}
                  className="text-red-500 mt-2 flex items-center gap-1"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
          <button
            onClick={() => setShowAddressForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Add Address
          </button>
        </div>
      </div>

      {showAddressForm && (
        <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressForm(false)} />
      )}

      <Link to="/" className="text-blue-500 mt-6 block">Back to Customer List</Link>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Delete Address</h2>
        <p>Are you sure you want to delete this address?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleDeleteAddress}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={closeDeleteModal}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default CustomerProfile;
