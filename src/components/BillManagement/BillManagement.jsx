import React, { useState, useEffect } from "react";
import "./BillManagement.css";
import Navbar from '../Navbar/Navbar';

const BillManagement = () => {
    const [billItems, setBillItems] = useState([]);
    const [newBillItem, setNewBillItem] = useState({ name: "", price: "", quantity: 1 });
    const [itemList, setItemList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date()); // State to store the current date and time

    // Fetch all items initially
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/items');
                const data = await response.json();
                setItemList(data);
            } catch (error) {
                console.error("Error fetching items:", error);
                setItemList([]); // Clear the list in case of error
            }
        };
        fetchItems();
    }, []);

    // Update the current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date()); // Update the current time
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    // Filter items based on the search query
    const filteredItems = itemList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToBill = () => {
        if (newBillItem.name && newBillItem.price && newBillItem.quantity > 0) {
            setBillItems([...billItems, { ...newBillItem, id: Date.now() }]);
            setSearchQuery("");
            setNewBillItem({ name: "", price: "", quantity: 1 });
        }
    };

    const handleRemoveFromBill = (id) => {
        setBillItems(billItems.filter((item) => item.id !== id));
    };

    const handleItemSelect = (item) => {
        setNewBillItem({ ...newBillItem, name: item.name, price: item.price });
        setSearchQuery(item.name); // Set the selected item name into the search query
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

    // Format current date and time
    const formattedDate = currentTime.toLocaleDateString(); // Format the date
    const formattedTime = currentTime.toLocaleTimeString(); // Format the time

    return (
        <div>
            <Navbar />
            <div className="bill-management">
                <h1>Bill Management</h1>

                {/* Display the current time on the left and date on the right */}
                <div className="time-date-container">
                    <p className="current-time"><strong>Time: {formattedTime}</strong></p>
                    <p className="current-date"><strong>Date: {formattedDate}</strong></p>
                </div>

                <div className="bill-form">
                    <input
                        type="text"
                        placeholder="Search Item"
                        value={searchQuery} // Bind the search query to the input field
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query as the user types
                    />

                    {/* Display list of items based on search */}
                    {searchQuery.trim() !== "" && filteredItems.length > 0 && (
                        <ul className="item-list">
                            {filteredItems.map((item) => (
                                <li key={item._id} onClick={() => handleItemSelect(item)}>
                                    {item.name} - Rs. {item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    )}

                    {searchQuery.trim() !== "" && filteredItems.length === 0 && (
                        <p>No items found matching "{searchQuery}"</p>
                    )}

                    <input
                        type="number"
                        placeholder="Price"
                        value={newBillItem.price}
                        readOnly
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
