import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Pizza Palace Logo" className="navbar-logo" />
                <h1>Pizza Palace</h1>
            </div>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <ul className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Item Management
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/billManagement" 
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Bill Management
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
