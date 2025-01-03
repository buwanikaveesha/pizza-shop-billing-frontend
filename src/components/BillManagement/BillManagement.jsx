import React, { useState, useEffect } from "react";
import "./BillManagement.css";
import Navbar from "../Navbar/Navbar";
import Invoice from "../Invoice/Invoice";
import shopLogo from "../../assets/images/logo.png";

const BillManagement = () => {
    const [billItems, setBillItems] = useState([]);
    const [newBillItem, setNewBillItem] = useState({ name: "", price: "", quantity: 1 });
    const [itemList, setItemList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/items");
                const data = await response.json();
                setItemList(data);
            } catch (error) {
                console.error("Error fetching items:", error);
                setItemList([]);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const filteredItems = itemList.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToBill = async () => {
        if (newBillItem.name && newBillItem.price && newBillItem.quantity > 0) {
            try {
                const response = await fetch("http://localhost:3000/api/bill-items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newBillItem),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to save the bill item: ${errorData.message || response.status}`);
                }
                const savedItem = await response.json();
                setBillItems([...billItems, savedItem]); 
            } catch (error) {
                console.error("Error adding item to bill:", error);
            }

            setSearchQuery("");
            setNewBillItem({ name: "", price: "", quantity: 1 });
        }
    };

    const handleRemoveFromBill = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/bill-items/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to remove item from bill");
            }
            setBillItems(billItems.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error removing item from bill:", error);
        }
    };

    const handleItemSelect = (item) => {
        setNewBillItem({ name: item.name, price: item.price, quantity: 1 });
        setSearchQuery(item.name);
    };

    const calculateSubtotal = () => {
        return billItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    
    const calculateTax = (subtotal) => {
        return subtotal * 0.1;
    };
    
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return subtotal + tax;
    };

    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();

    const shopDetails = {
        name: "Pizza Palace",
        logo: shopLogo,
        address: "No:7, Pizza Street, Colombo",
        contact: "+94745236801",
    };

    const handleGenerateInvoice = () => {
        setShowInvoice(true);
    };

    const handleCloseInvoice = () => {
        setShowInvoice(false);
    };

    return (
        <div>
            <Navbar />
            <div className="bill-management">
                <h1>Bill Management</h1>

                <div className="time-date-container">
                    <p className="current-time"><strong>Time: {formattedTime}</strong></p>
                    <p className="current-date"><strong>Date: {formattedDate}</strong></p>
                </div>

                {showInvoice ? (
                    <Invoice
                        billItems={billItems}
                        shopDetails={shopDetails}
                        subtotal={calculateSubtotal()}
                        tax={calculateTax(calculateSubtotal())}
                        total={calculateTotal()}
                        onClose={handleCloseInvoice}
                    />
                ) : (
                    <>
                        <div className="bill-form">
                            <input
                                type="text"
                                placeholder="Search Item"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {searchQuery.trim() !== newBillItem.name && searchQuery.trim() !== "" && filteredItems.length > 0 && (
                                <ul className="item-list">
                                    {filteredItems.map((item) => (
                                        <li key={item._id} onClick={() => handleItemSelect(item)}>
                                            {item.name} - Rs. {item.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {searchQuery.trim() !== newBillItem.name && searchQuery.trim() !== "" && filteredItems.length === 0 && (
                                <p>No items found matching "{searchQuery}"</p>
                            )}

                            <input
                                type="number"
                                placeholder="Price"
                                value={newBillItem.price}
                                readOnly={true}
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
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>Rs. {item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleRemoveFromBill(item._id)}>Remove</button>
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

                        <button className="generate-invoice-button" onClick={handleGenerateInvoice}>
                            Generate Invoice
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BillManagement;
