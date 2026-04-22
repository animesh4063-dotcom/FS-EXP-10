import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './api';

// --- REQUIREMENT B: LOGIN FORM ---
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data); // Save the JWT
            setMessage({ text: "Login Successful!", type: "success" });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            const errorMsg = error.response?.status === 403 ? "Invalid credentials!" : "Server error.";
            setMessage({ text: errorMsg, type: "error" });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Login</button>
            </form>
            {message && <p style={{ color: message.type === 'error' ? 'red' : 'green', fontWeight: 'bold' }}>{message.text}</p>}
        </div>
    );
}

// --- REQUIREMENT A & C: DASHBOARD ---
function Dashboard() {
    const [products, setProducts] = useState([]);
    const [adminSecret, setAdminSecret] = useState('');

    useEffect(() => {
        // Fetch Public Data
        api.get('/auth/public/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const fetchProtectedData = async () => {
        try {
            const res = await api.get('/auth/admin-data'); // Sends JWT automatically!
            setAdminSecret(res.data);
        } catch (error) {
            alert("Access Denied! You do not have admin privileges.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Dashboard</h2>
            <button onClick={handleLogout} style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none' }}>Logout</button>
            <hr />
            
            <h3>Public Catalog</h3>
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead style={{ background: '#eee' }}><tr><th>ID</th><th>Name</th><th>Price</th></tr></thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.price}</td></tr>
                    ))}
                </tbody>
            </table>

            <hr />
            <h3>VIP Admin Area</h3>
            <button onClick={fetchProtectedData} style={{ background: 'green', color: 'white', padding: '10px', border: 'none' }}>Fetch Admin Secrets</button>
            {adminSecret && <p style={{ color: 'blue', fontSize: '18px', fontWeight: 'bold' }}>{adminSecret}</p>}
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}