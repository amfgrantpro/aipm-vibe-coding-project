import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles.css';

function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🎯 Todo Cal</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        🏠 Home
                    </Link>
                    <Link to="/calendar" className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
                        🗓 Calendar
                    </Link>
                </nav>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;
