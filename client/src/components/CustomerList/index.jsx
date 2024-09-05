import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../themecontext';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/customers?page=${currentPage}&search=${search}`);
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching customers.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${selectedCustomer}`);
      fetchCustomers();
      toast.success('Customer deleted successfully!');
      setModalIsOpen(false);
    } catch (error) {
      toast.error('Error deleting customer.');
    }
  };

  return (
    <div className={`p-6 mt-[50px] h-full ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          className="border p-2 rounded w-full sm:w-1/3 mb-4 sm:mb-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <button onClick={toggleTheme} className="mr-4 p-2 border rounded">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Customer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`border rounded-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Skeleton height={30} />
              <Skeleton height={20} />
              <Skeleton height={20} width="50%" />
            </div>
          ))
        ) : (
          customers.map((customer) => (
            <div
              key={customer._id}
              className={`border rounded-md p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <h3 className="text-lg font-semibold">
                <Link to={`/profile/${customer._id}`} className="text-blue-500 hover:underline">
                  {`${customer.firstName} ${customer.lastName}`}
                </Link>
              </h3>
              <p className="text-sm">{customer.email}</p>
              <div className="mt-2 flex justify-between">
                <Link to={`/edit/${customer._id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setSelectedCustomer(customer._id);
                    setModalIsOpen(true);
                  }}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        {loading ? (
          <Skeleton width={100} height={30} />
        ) : (
          <>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="max-w-md mx-auto bg-white p-6 rounded shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this customer?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </Modal>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default CustomerList;
