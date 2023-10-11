import React, { useState } from 'react';
import axios from 'axios';

function RentalForm() {
  const [rentalDate, setRentalDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState('');
  const [inventoryId, setInventoryId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [rentalId, setRentalId] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/rental/create/', {
        rental_date: rentalDate.toISOString(),
        return_date: returnDate ? returnDate.toISOString() : null,
        inventory_id: inventoryId,
        customer_id: customerId,
        staff_id: staffId,
        rental_id: rentalId,
        last_update: lastUpdate.toISOString(),
      });

      console.log('Server Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
    }
  }
  return (
    <div>
      <h1>Rental A Movie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rentalId">Rental ID:</label>
          <input
            type="number"
            id="rentalId"
            value={rentalId}
            onChange={(e) => setRentalId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rentalDate">Rental Date:</label>
          <input
            type="datetime-local"
            id="rentalDate"
            value={rentalDate.toISOString().slice(0, 16)}
            onChange={(e) => setRentalDate(new Date(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="inventoryId">Inventory ID:</label>
          <input
            type="number"
            id="inventoryId"
            value={inventoryId}
            onChange={(e) => setInventoryId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="customerId">Customer ID:</label>
          <input
            type="number"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="returnDate">Return Date:</label>
          <input
            type="datetime-local"
            id="returnDate"
            value={returnDate ? returnDate.toISOString().slice(0, 16) : ''}
            onChange={(e) => setReturnDate(new Date(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="staffId">Staff ID:</label>
          <input
            type="number"
            id="staffId"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastUpdate">Last Update:</label>
          <input
            type="datetime-local"
            id="lastUpdate"
            value={lastUpdate.toISOString().slice(0, 16)}
            onChange={(e) => setLastUpdate(new Date(e.target.value))}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default RentalForm;
