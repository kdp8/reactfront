import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line
  const [showAll, setShowAll] = useState(false);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editedAddressId, setEditedAddressId] = useState('');
  const [rentedMovies, setRentedMovies] = useState([]);
  const [editedAddress, setEditedAddress] = useState('');
  const [editedActive, setEditedActive] = useState('');
  const [editedLastUpdate, setEditedLastUpdate] = useState('');

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
    setEditedAddress(customerToEdit.address);
    setEditedActive(customerToEdit.active);
    setEditedLastUpdate(new Date().toISOString());
  };

  const handleSaveEdit = () => {
    const activeValue = parseInt(editedActive);
  
    if (activeValue !== 0 && activeValue !== 1) {
      alert("Active field must be either 0 or 1.");
      return;
    }

    const updatedCustomer = {
      first_name: editedFirstName,
      last_name: editedLastName,
      email: editedEmail,
      address: editedAddress,
      active: editedActive,
      last_update: new Date().toISOString(),
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
        setEditedAddress('');
        setEditedActive('');
        setEditedLastUpdate('');
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

  const handleAddCustomer = () => {
    setIsAddingCustomer(true);
  };

  const handleSaveNewCustomer = () => {
    const newCustomer = {
      first_name: editedFirstName,
      last_name: editedLastName,
      email: editedEmail,
      create_date: new Date().toISOString(),
      active: 1,
      store: 1,
      address: editedAddressId || 1,
    };
  
    axios
      .post('http://127.0.0.1:8000/customers/create/', newCustomer)
      .then((response) => {
        setCustomers([...customers, response.data]);
        setIsAddingCustomer(false); //reset
        setEditedFirstName('');
        setEditedLastName('');
        setEditedEmail('');
        setEditedAddressId('');
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const handleCancelNewCustomer = () => {
    setIsAddingCustomer(false);
    setEditedFirstName('');
    setEditedLastName('');
    setEditedEmail('');
  };

  const handleFetchRentedMovies = (customerId) => {
    axios.get(`http://127.0.0.1:8000/customers/${customerId}/rented-movies/`)
      .then((response) => {
        const rentedMoviesData = response.data.rented_movies;
        setRentedMovies(rentedMoviesData);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Customer List</h1>
      <div>
        <input
          type="text"
          placeholder="Search by ID, First Name, or Last Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleShowAll}>Show All</button>
      </div>

      {!isAddingCustomer ? (
        <button onClick={handleAddCustomer}>Add Customer</button>
      ) : (
        <div>
          <h2>Add a new Customer</h2>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Address ID:</label>
            <input
              type="text"
              value={editedAddressId}
              onChange={(e) => setEditedAddressId(e.target.value)}
            />
            <label>(Leave empty for deafault ID 1)</label>            
          </div>
          <div>
            <button onClick={handleSaveNewCustomer}>Save</button>
            <button onClick={handleCancelNewCustomer}>Cancel</button>
          </div>
        </div>
      )}

      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Active</th>
          <th>Create Date</th>
          <th>Last Update</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.customer_id}>
            <td>
              <button onClick={() => handleFetchRentedMovies(customer.customer_id)}>
                {customer.customer_id}
              </button>
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="text"
                  value={editedFirstName}
                  onChange={(e) => setEditedFirstName(e.target.value)}
                />
              ) : (
                customer.first_name
              )}
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="text"
                  value={editedLastName}
                  onChange={(e) => setEditedLastName(e.target.value)}
                />
              ) : (
                customer.last_name
              )}
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="text"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              ) : (
                customer.email
              )}
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="text"
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                />
              ) : (
                customer.address
              )}
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="number"
                  value={editedActive}
                  onChange={(e) => setEditedActive(e.target.value)}
                  min={0}
                  max={1}
                  step={1}
                />
              ) : (
                customer.active
              )}
            </td>
            <td>{customer.create_date}</td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <input
                  type="text"
                  value={editedLastUpdate}
                  onChange={(e) => setEditedLastUpdate(e.target.value)}
                />
              ) : (
                customer.last_update
              )}
            </td>
            <td>
              {editingCustomerId === customer.customer_id ? (
                <>
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(customer.customer_id)}>Edit</button>
                  <button onClick={() => handleDelete(customer.customer_id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
      </table>

      {rentedMovies.length > 0 && (
        <div>
          <h2>Rented Movies</h2>
          <table>
            <thead>
              <tr>
                <th>Rental ID</th>
                <th>Movie Title</th>
                <th>Rental Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {rentedMovies.map((movie, index) => (
                <tr key={index}>
                  <td>{movie.rental_id}</td>
                  <td>{movie.film_title}</td>
                  <td>{movie.rental_date}</td>
                  <td>{movie.return_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noResults && <p>No results found.</p>}

    </div>
  );
}

export default Customer;
