import React, { useState, useEffect } from "react";
import "./ItemManagement.css";
import Navbar from '../Navbar/Navbar';

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState(null);

    // Fetch items from the backend
    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.price || isNaN(Number(newItem.price)) || Number(newItem.price) <= 0) {
            alert("Please enter a valid name and price.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                fetchItems();
                setNewItem({ name: "", price: "" });
            } else {
                alert("Error adding item.");
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/items/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchItems();
            } else {
                alert("Error deleting item.");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleUpdateItem = async () => {
        if (!newItem.name || !newItem.price || isNaN(Number(newItem.price)) || Number(newItem.price) <= 0) {
            alert("Please enter a valid name and price.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/items/${editingItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                fetchItems();
                setEditingItem(null);
                setNewItem({ name: "", price: "" });
            } else {
                alert("Error updating item.");
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div className="item-management">
                <h1 className="item-management-topic">Item Management</h1>

                <div className="item-management-search-bar">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search items"
                    />
                </div>

                <div className="item-management-item-form">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        aria-label="Item name"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        aria-label="Item price"
                    />
                    <button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                        {editingItem ? "Update Item" : "Add Item"}
                    </button>
                </div>

                {filteredItems.length === 0 ? (
                    <p>No items found</p>
                ) : (
                    <ul className="item-management-item-list">
                        {filteredItems.map((item) => (
                            <li key={item._id} className="item-management-item">
                                <div className="item-name">{item.name}</div>
                                <div className="item-price">Rs. {item.price.toFixed(2)}</div>
                                <div className="item-management-item-buttons">
                                    <button
                                        className="item-management-item-button"
                                        onClick={() => handleDeleteItem(item._id)}
                                        aria-label={`Delete ${item.name}`}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="item-management-item-button"
                                        onClick={() => {
                                            setEditingItem(item);
                                            setNewItem({ name: item.name, price: item.price });
                                        }}
                                        aria-label={`Edit ${item.name}`}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ItemManagement;
