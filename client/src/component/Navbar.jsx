import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const getNavigation = (isAuthenticated) => {
    if (isAuthenticated) {
        return [
            { name: 'Home', href: '/' },
            { name: 'Logout', onClick: 'logout' },
        ];
    } else {
        return [
            { name: 'Home', href: '/' },
            { name: 'Register', href: '/register' },
            { name: 'Login', href: '/login' },
        ];
    }
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar({ isAuthenticated, handleLogout }) {
    const location = useLocation();
    const navigation = getNavigation(isAuthenticated);

    const handleNavigationClick = (event, item) => {
        if (item.onClick === 'logout') {
            event.preventDefault();
            handleLogout();
        }
    };

    return (
        <nav className="sticky-nav">
            <div className="nav-links">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        onClick={(event) => handleNavigationClick(event, item)}
                        className={classNames(
                            location.pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-gray',
                            'text-m font-medium'
                        )}
                    >
                    {item.name}
                    </Link>
                ))}
             </div>
        </nav>
    );
}
