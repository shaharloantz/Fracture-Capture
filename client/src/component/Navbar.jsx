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
        <nav className="absolute top- right-0 mt-4 mr-8">
            <div className="flex space-x-4">
                {navigation.map((item, index) => (
                    <React.Fragment key={item.name}>
                        <Link
                            to={item.href}
                            onClick={(event) => handleNavigationClick(event, item)}
                            className={classNames(
                                location.pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-gray',
                                'text- font-medium'
                            )}
                        >
                            {item.name}
                        </Link>
                        {index < navigation.length - 1 && (
                            <span className="text-gray-300">|</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
}
