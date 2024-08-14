import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css'; // Adjust the path if necessary

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState('isAdmin'); // Default sort by isAdmin

    useEffect(() => {
        axios.get('/user/all-users', { withCredentials: true })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
            });
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sortOption === 'isAdmin') {
            return (b.isAdmin === true) - (a.isAdmin === true);
        } else if (sortOption === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'email') {
            return a.email.localeCompare(b.email);
        } else if (sortOption === 'numberOfPatients') {
            return b.numberOfPatients - a.numberOfPatients;
        }
        
        return 0;
    });
    

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="sort-options">
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="isAdmin">Group (Admin/Regular)</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="email">Email (A-Z)</option>
                    <option value="numberOfPatients">Number of Patients</option>
                </select>
            </div>
            {sortedUsers.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Group</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Number of Patients</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.isAdmin ? 'Admin' : 'Regular'}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.numberOfPatients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default AdminPanel;
