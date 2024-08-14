import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css'; // Adjust the path if necessary

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState('isAdmin'); // Default sort by isAdmin
    const [editingUserId, setEditingUserId] = useState(null); // Track the user being edited
    const [editedUserData, setEditedUserData] = useState({ name: '', email: '' });

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

    const handleEditClick = (user) => {
        if (editingUserId === user._id) {
            // If the user is already being edited, close the editing mode
            setEditingUserId(null);
        } else {
            // Otherwise, open the editing mode for this user
            setEditingUserId(user._id);
            setEditedUserData({ name: user.name, email: user.email });
        }
    };
    
    const handleCancelClick = () => {
        setEditingUserId(null); // Close the editing mode
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData({ ...editedUserData, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`/user/update/${editingUserId}`, editedUserData, { withCredentials: true });
            setUsers(users.map(user => user._id === editingUserId ? { ...user, ...editedUserData } : user));
            setEditingUserId(null); // Close the edit mode
        } catch (error) {
            console.error('Error updating user:', error.response ? error.response.data : error.message);
        }
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
            <h2>Admin Panel</h2>
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
                            <>
                                <tr key={user._id}>
                                    <td>{user.isAdmin ? 'Admin' : 'Regular'}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        {user.email} 
                                        {!user.isAdmin && (
                                        <img 
                                            src="/src/assets/images/pen.png" 
                                            alt="Edit" 
                                            className="admin-edit" 
                                            onClick={() => handleEditClick(user)} 
                                        />
                                        )}
                                    </td>
                                    <td>{user.numberOfPatients}</td>
                                </tr>
                                                 {editingUserId === user._id && (
                                                <tr key={`edit-${user._id}`} className="edit-row">
                                                    <td colSpan="4">
                                                        <div className="edit-form">
                                                            <div className="form-row">
                                                                <label>
                                                                    Name: 
                                                                    <input 
                                                                        type="text" 
                                                                        name="name" 
                                                                        value={editedUserData.name} 
                                                                        onChange={handleInputChange} 
                                                                        style={{color:'black'}}
                                                                    />
                                                                </label>
                                                                <label>
                                                                    Email: 
                                                                    <input 
                                                                        type="email" 
                                                                        name="email" 
                                                                        value={editedUserData.email} 
                                                                        onChange={handleInputChange} 
                                                                        style={{color:'black'}}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="button-row">
                                                                <button onClick={handleSaveClick}>Save</button>
                                                                <button onClick={handleCancelClick}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                            </>
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
