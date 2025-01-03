import React, { useState } from "react";
import "./BillManagement.css";
import Navbar from '../Navbar/Navbar';


const BillManagement = () => {
    const [billItems, setBillItems] = useState([]);
    const [newBillItem, setNewBillItem] = useState({ name: "", price: "", quantity: 1 });

    const handleAddToBill = () => {
        if (newBillItem.name && newBillItem.price && newBillItem.quantity > 0) {
            setBillItems([...billItems, { ...newBillItem, id: Date.now() }]);
            setNewBillItem({ name: "", price: "", quantity: 1 });
        }
    };

    const handleRemoveFromBill = (id) => {
        setBillItems(billItems.filter((item) => item.id !== id));
    };

    const calculateSubtotal = () => {
        return billItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTax = (subtotal) => {
        return (subtotal * 0.1).toFixed(2);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return (subtotal + parseFloat(tax)).toFixed(2);
    };

    return (
        <div>
            <Navbar />
            <div className="bill-management">
                <h1>Bill Management</h1>

                <div className="bill-form">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newBillItem.name}
                        onChange={(e) => setNewBillItem({ ...newBillItem, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newBillItem.price}
                        onChange={(e) => setNewBillItem({ ...newBillItem, price: parseFloat(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newBillItem.quantity}
                        onChange={(e) => setNewBillItem({ ...newBillItem, quantity: parseInt(e.target.value) })}
                    />
                    <button onClick={handleAddToBill}>Add to Bill</button>
                </div>

                <table className="bill-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>Rs. {item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleRemoveFromBill(item.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="bill-summary">
                    <p>Subtotal: Rs. {calculateSubtotal().toFixed(2)}</p>
                    <p>Tax (10%): Rs. {calculateTax(calculateSubtotal())}</p>
                    <p>Total: Rs. {calculateTotal()}</p>
                </div>
            </div>
        </div>
    );
};

export default BillManagement;
