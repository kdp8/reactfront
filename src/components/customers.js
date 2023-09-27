import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [noResults, setNoResults] = useState(false);

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
              {customer.customer_id}: {customer.first_name} {customer.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Customer;
