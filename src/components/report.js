import React, { Component } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class CustomerReport extends Component {
  state = {
    customers: [],
  };

  componentDidMount() {
    axios
      .get('http://127.0.0.1:8000/customer-rented-movies/')
      .then((response) => {
        this.setState({ customers: response.data });
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }

  generatePDF = () => {
    const { customers } = this.state;
  
    const doc = new jsPDF();
  
    const tableHeaders = ['Customer Name', 'Inventory ID', 'Rental Date', 'Return Date'];
  
    const tableData = [];
  
    customers.forEach((customer) => {
      customer.rented_movies.forEach((movie) => {
        tableData.push([
          `${customer.first_name} ${customer.last_name}`,
          movie.inventory_id,
          movie.rental_date,
          movie.return_date || 'Not returned yet',
        ]);
      });
    });
  
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
    });
  
    doc.save('report.pdf');
  };  

render() {
    const { customers } = this.state;
  
    return (
      <div>
        <h1>Customers Report</h1>
        <button onClick={this.generatePDF}>Download PDF</button>
        <div id="pdf-content">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Inventory ID</th>
                <th>Rental Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{`${customer.first_name} ${customer.last_name}`}</td>
                  <td>
                    {customer.rented_movies.map((movie) => (
                      <div key={movie.inventory_id}>
                        {movie.inventory_id}
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.rented_movies.map((movie) => (
                      <div key={movie.film_id}>
                        {movie.rental_date}
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.rented_movies.map((movie) => (
                      <div key={movie.film_id}>
                        {movie.return_date || 'Not returned yet'}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }  
}

export default CustomerReport;
