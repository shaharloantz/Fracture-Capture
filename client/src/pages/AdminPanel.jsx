import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';
import {toast} from 'react-hot-toast';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState('isAdmin'); 
    const [editingUserId, setEditingUserId] = useState(null); 
    const [editedUserData, setEditedUserData] = useState({ name: '', email: '' });
    const totalUsers = users.length;
    const totalPatients = users.reduce((acc, user) => acc + user.numberOfPatients, 0);
    
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

    const handleDeleteClick = (user) => {
        toast(
          (t) => (
            <span>
              Are you sure you want to delete <strong>{user.name}</strong>, his patients and all of its data? 
              <div style={{ marginTop: '10px' ,display: 'flex', justifyContent: 'center'}}>
                <button
                  onClick={() => confirmDelete(user._id, t.id)}
                  style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: 'orange', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                >
                  Yes
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{ padding: '5px 10px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  No
                </button>
              </div>
            </span>
          ),
          { duration: 5000 } 
        );
      };
    
      const confirmDelete = async (userId, toastId) => {
        try {
          await axios.delete(`/user/delete/${userId}`, { withCredentials: true });
          setUsers(users.filter(user => user._id !== userId)); // Update state to remove the user from the list
          toast.dismiss(toastId); 
          toast.success('User deleted successfully!');
        } catch (error) {
          toast.dismiss(toastId); 
          toast.error('Error deleting user.');
        }
      };
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData({ ...editedUserData, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`/user/update/${editingUserId}`, editedUserData, { withCredentials: true });
            setUsers(users.map(user => user._id === editingUserId ? { ...user, ...editedUserData } : user));
            setEditingUserId(null); 
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
            <h1 style={{textAlign:'center'}}>Admin Panel</h1>
            <div className="sort-options">
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                    <option value="isAdmin">Group</option>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
                            <>
                                <tr key={user._id}>
                                    <td>{user.isAdmin ? 'Admin' : 'Regular'}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.numberOfPatients}</td>
                                    <td>
                                        <div className="action-icons">
                                            {!user.isAdmin && (
                                                <>
                                                    <img 
                                                        src="/src/assets/images/pen.png" 
                                                        alt="Edit" 
                                                        className="admin-edit" 
                                                        onClick={() => handleEditClick(user)} 
                                                    />
                                                    <img 
                                                        src="/src/assets/images/delete.png" 
                                                        alt="Delete" 
                                                        className="admin-delete" 
                                                        onClick={() => handleDeleteClick(user)} 
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                                {editingUserId === user._id && (
                                    <tr key={`edit-${user._id}`} className="edit-row">
                                        <td colSpan="5">
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
                        <div className="totals">
                <p>Total Users: {totalUsers}</p>
                <p>Total Patients: {totalPatients}</p>
            </div>
        </div>
    );
};

export default AdminPanel;
