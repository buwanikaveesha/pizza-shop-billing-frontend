import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="navbar-brand">Pizza Shop</h1>
            <ul className="navbar-links">
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Item Management
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/billManagement" 
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Bill Management
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
