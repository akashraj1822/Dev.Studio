import { Outlet, NavLink } from 'react-router-dom';
import { Home, List, FolderOpen, CreditCard, User } from 'lucide-react';

function BottomNav() {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/leads', icon: List, label: 'Leads' },
        { to: '/projects', icon: FolderOpen, label: 'Projects' },
        { to: '/billing', icon: CreditCard, label: 'Billing' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'var(--nav-height)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)', // Safe area for iPhones
        }}>
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                        fontSize: '10px',
                        textDecoration: 'none',
                        fontWeight: '500',
                        width: '100%',
                        height: '100%',
                    })}
                >
                    <Icon size={24} strokeWidth={2} style={{ marginBottom: '4px' }} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default function Layout() {
    return (
        <>
            <Outlet />
            <BottomNav />
        </>
    );
}
