/**
 * AdminPanel Page
 * 
 * This component serves as the administrative interface for managing user accounts and their associated data within the application.
 * It provides functionalities for viewing all registered users, sorting them by various criteria, editing user details, and deleting users
 * along with all their associated data. The component is designed to facilitate user management tasks typically required by an admin role.
 * 
 * Key Functionalities:
 * 
 * 1. **User Management**:
 *    - Displays a list of all users with relevant details such as name, email, user group (admin or regular), and the number of patients associated with them.
 *    - Allows for editing and updating user details, specifically name and email.
 *    - Provides the ability to delete users and all their associated data from the system, with a confirmation step to prevent accidental deletions.
 * 
 * 2. **Sorting and Filtering**:
 *    - Users can be sorted by different attributes including group (admin or regular), name, email, and the number of patients.
 *    - The sort functionality allows the admin to easily organize and manage the user list based on the selected criteria.
 * 
 * 3. **Editing User Details**:
 *    - Admins can edit a user's name and email directly from the user list.
 *    - The editing mode is activated by clicking an edit icon next to the user's details.
 *    - Provides input fields for updating user information and buttons to save changes or cancel editing.
 * 
 * 4. **Deleting Users**:
 *    - Users can be deleted by clicking the delete icon, which triggers a confirmation dialog.
 *    - The confirmation dialog prevents accidental deletions by requiring explicit confirmation from the admin.
 *    - Upon confirmation, the user is removed from the list, and the server is notified to delete the user's data.
 * 
 * 5. **Dynamic State Management**:
 *    - Uses state variables to manage the list of users, sorting options, editing states, and the data of the user being edited.
 *    - The state is updated dynamically based on user interactions and API responses to ensure the interface reflects the latest data.
 * 
 * Hooks Used:
 * - `useState`: Manages the local state for users, sort options, editing states, edited user data, and totals.
 * - `useEffect`: Fetches the list of all users from the server when the component mounts.
 * 
 * Component Structure:
 * - Displays a table of users with sorting options and action icons for each user.
 * - Provides a form for editing user details when an edit action is triggered.
 * - Shows a confirmation dialog for delete actions to ensure data integrity and prevent unintended deletions.
 * - Displays the total number of users and patients at the bottom of the panel for quick reference.
 * 
 * External Dependencies:
 * - `axios`: Used for making HTTP requests to fetch and manipulate user data from the server.
 * - `react-hot-toast`: Provides user notifications for actions such as deletions and updates, enhancing the user experience with real-time feedback.
 * 
 */

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
                                            {user.isAdmin && (<p>-</p>)}
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
