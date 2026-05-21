import React, { useState } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { identifier, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onLogin = async e => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await api.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setMessage('Login successful!');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your account</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={onLogin}>
                    <div className="form-group">
                        <label>Email or Mobile</label>
                        <input
                            type="text"
                            name="identifier"
                            className="form-control"
                            placeholder="Email or Mobile"
                            value={identifier}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">Login</button>
                </form>

                <div className="text-center mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
