import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const onLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    Expense<span>Tracker</span>
                </NavLink>

                <ul className="nav-menu">
                    {token ? (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/expenses"
                                    className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}
                                >
                                    Expenses
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/add-expense"
                                    className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}
                                >
                                    Add Expense
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button onClick={onLogout} className="btn-logout">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
