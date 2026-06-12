import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/expenses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExpenses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchExpenses();
    }, []);

    return (
        <div className="container" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
            <div className="auth-card" style={{ maxWidth: '900px' }}>
                <div className="auth-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                    <div>
                        <h1>All Expenses</h1>
                        <p>Detailed list of your spending</p>
                    </div>
                    <button onClick={() => navigate('/add-expense')} className="btn btn-primary" style={{ width: 'auto' }}>+ New</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No expenses found</td>
                                </tr>
                            ) : (
                                expenses.map(exp => (
                                    <tr key={exp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{exp.title}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                backgroundColor: 'var(--bg)',
                                                fontSize: '0.75rem'
                                            }}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                            ${exp.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline mt-4">Back to Dashboard</button>
            </div>
        </div>
    );
};

export default ExpenseList;
