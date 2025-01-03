import React from "react";
import "./Invoice.css";

const Invoice = ({ billItems, shopDetails, subtotal, tax, total, onClose }) => {
    const formattedDate = new Date().toLocaleDateString();
    const formattedTime = new Date().toLocaleTimeString();

    const handlePrint = () => {
        const printContent = document.querySelector(".invoice-container").outerHTML;
        const newWindow = window.open("", "_blank", "width=800,height=600");
        newWindow.document.open();
        newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Invoice</title>
            <style>
                /* Reset default styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 0;
                }
                .invoice-container {
                    width: 100%;
                    max-width: 800px;
                    margin: auto;
                    height: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    color: #333;
                }
                .invoice-header,
                .invoice-info,
                .invoice-summary,
                .invoice-footer {
                    text-align: center;
                    margin-top: 40px;
                }
                .shop-logo {
                    max-width: 100px; /* Adjust the width */
                    height: auto;
                    margin-bottom: 10px;
                }
                .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .invoice-table th,
                .invoice-table td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                .invoice-summary p {
                    margin: 5px 0;
                }
                .invoice-footer {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            ${printContent}
        </body>
        </html>
        `);
        newWindow.document.close();
    };
    

    return (
        <div>
            <div className="invoice-container">
                <div className="invoice-header">
                    <img src={shopDetails.logo} alt="Shop Logo" className="shop-logo" />
                    <div className="shop-details">
                        <h1>{shopDetails.name}</h1>
                        <p>{shopDetails.address}</p>
                        <p>Contact: {shopDetails.contact}</p>
                    </div>
                </div>

                <div className="invoice-info">
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time:</strong> {formattedTime}</p>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>Rs. {item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-summary">
                    <p><strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}</p>
                    <p><strong>Tax (10%):</strong> Rs. {tax.toFixed(2)}</p>
                    <p><strong>Total:</strong> Rs. {total.toFixed(2)}</p>
                </div>

                <div className="invoice-footer">
                    <p>Thank you for choosing {shopDetails.name}!</p>
                    <p>We hope to see you again soon!</p>
                </div>
            </div>

            <div className="invoice-actions">
                <button onClick={onClose} className="close-invoice-button">
                    Close Invoice
                </button>
                <button
                    onClick={handlePrint}
                    className="print-invoice-button"
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
};

export default Invoice;
