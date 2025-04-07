// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const register = async () => {
        try {
            const response = await axios.post('http://localhost:5000/register', { username, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            setToken(response.data.token);
            setMessage('Login successful');
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const getProtected = async () => {
        try {
            const response = await axios.get('http://localhost:5000/protected', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Unauthorized');
        }
    };

    return (
        <div className="app">
            <h1>JWT Authentication App</h1>
            <div className="auth-section">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={register}>Register</button>
            </div>
            <div className="auth-section">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={login}>Login</button>
            </div>
            <div className="auth-section">
                <h2>Access Protected Data</h2>
                <button onClick={getProtected}>Get Protected Data</button>
            </div>
            <div className="message-section">
                <h2>Message</h2>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default App;
