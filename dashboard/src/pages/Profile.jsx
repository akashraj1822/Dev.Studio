import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="container">
            <h1 className="title">Profile</h1>
            <div className="card">
                <div className="subtitle">Admin Actions</div>
                <button onClick={handleLogout} className="btn" style={{ background: '#FF3B30' }}>
                    Logout
                </button>
            </div>
        </div>
    );
}
