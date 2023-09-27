import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/customers/')
      .then((response) => {
        setCustomers(response.data);
        setOriginalCustomers(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    const filteredCustomers = originalCustomers.filter((customer) =>
      customer.customer_id.toString().includes(searchQuery) ||
      customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCustomers.length === 0) {
      setNoResults(true); 
    } else {
      setNoResults(false);
    }
    setCustomers(filteredCustomers);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setCustomers(originalCustomers);
    setSearchQuery('');
    setShowAll(true);
    setNoResults(false);
  };

  const handleEdit = (customerId) => {
    const customerToEdit = customers.find((customer) => customer.customer_id === customerId);
    setEditingCustomerId(customerId);
    setEditedFirstName(customerToEdit.first_name);
    setEditedLastName(customerToEdit.last_name);
    setEditedEmail(customerToEdit.email || '');
  };

  const handleSaveEdit = () => {
    const updatedCustomer = {
      first_name: editedFirstName,
      last_name: editedLastName,
      email: editedEmail,
    };

    axios.put(`http://127.0.0.1:8000/customers/${editingCustomerId}/update/`, updatedCustomer)
      .then((response) => {
        const updatedCustomers = customers.map((customer) =>
          customer.customer_id === editingCustomerId ? { ...customer, ...updatedCustomer } : customer
        );
        setCustomers(updatedCustomers);
        setEditingCustomerId(null);
        setEditedFirstName('');
        setEditedLastName('');
        setEditedEmail('');
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const handleCancelEdit = () => {
    setEditingCustomerId(null);
    setEditedFirstName('');
    setEditedLastName('');
    setEditedEmail('');
  };

  const handleDelete = (customerId) => {
    // prompt
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:8000/customers/${customerId}/delete/`)
        .then(() => {
          const updatedCustomers = customers.filter((customer) => customer.customer_id !== customerId);
          setCustomers(updatedCustomers);
          window.location.reload();
        })
        .catch((error) => console.error(error));
    }
  };
  

  return (
    <div>
      <h1>Customer List</h1>
      <div>
        <input
          type="text"
          placeholder="Search by ID, first name, or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {showAll && <button onClick={handleShowAll}>Show All</button>}
      </div>
      {noResults ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer.customer_id}>
              {editingCustomerId === customer.customer_id ? (
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  {customer.customer_id}: {customer.first_name} {customer.last_name} - {customer.email}
                  <button onClick={() => handleEdit(customer.customer_id)}>Edit</button>
                  <button onClick={() => handleDelete(customer.customer_id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Customer;
