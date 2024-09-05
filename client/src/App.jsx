import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerProfile from './components/CustomerProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  return (
    <Router>
      <div className="container mx-auto px-4">
  <h1 className="border-b-gray-900 border-b  p-4  text-3xl font-bold mt-4 text-center  animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">Customer Management System</h1>

        <Routes>
          <Route exact path="/" element={<CustomerList/>} />
          <Route path="/add" element={<CustomerForm/>} />
          <Route path="/edit/:id" element={<CustomerForm/>} />
          <Route path="/profile/:id" element={<CustomerProfile/>} />
        </Routes>
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
    </Router>
  );
}

export default App;