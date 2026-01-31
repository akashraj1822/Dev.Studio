import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="title" style={{ textAlign: 'center' }}>Admin Login</h1>

                {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <label className="subtitle" style={{ display: 'block' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label className="subtitle" style={{ display: 'block' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            </div>
            <p style={{ marginTop: '20px', color: '#666', fontSize: '13px' }}>
                Private Dashboard. Unauthorized access prohibited.
            </p>
        </div>
    );
}
