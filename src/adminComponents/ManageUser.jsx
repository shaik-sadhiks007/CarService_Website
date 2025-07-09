import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import VirtualKeyboard from '../components/VirtualKeyboard';
import Sidebar from "../components/Sidebar";
import RightSidebar from "../sidebar/RightSidebar";
import { CarDataContext } from '../components/CarDataContext';
import { toast } from 'react-toastify';

function ManageUser() {

    const {
        userRole,
        apiUrl,
        showOffcanvas,
    } = useContext(CarDataContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [keyboardInput, setKeyboardInput] = useState('');
    const [activeInput, setActiveInput] = useState(null);
    const activeInputRef = useRef(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.username.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/v1/carService/getAllUserInfo`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            // handle error
        }
        setLoading(false);
    };

    const handleToggleActive = async (userId, currentActive) => {
        // Find the user object by userId
        const user = users.find(u => u.userId === userId);
        if (!user) return;

        // Clone the user object and toggle the 'active' field
        const updatedUser = {
            ...user,
            active: !currentActive
        };

        try {
            await axios.post(
                `${apiUrl}/api/register/update-user`,
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchUsers();
        } catch (error) {
            // handle error
        }
    };

    const handleInputFocus = (field, value, ref) => {
        setActiveInput(field);
        setShowKeyboard(true);
        setKeyboardInput(value || '');
        if (ref) activeInputRef.current = ref;
    };
    const handleKeyboardChange = (val) => {
        setKeyboardInput(val);
        if (activeInput === 'searchText') setSearchText(val);
    };
    const handleKeyboardClose = () => {
        setShowKeyboard(false);
        setActiveInput(null);
        if (activeInputRef.current) activeInputRef.current.blur();
    };
    const handlePhysicalKeyDown = (e) => {
        if (showKeyboard) {
            e.preventDefault();
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                handleKeyboardChange(keyboardInput + e.key);
            } else if (e.key === 'Backspace') {
                handleKeyboardChange(keyboardInput.slice(0, -1));
            } else if (e.key === ' ') {
                handleKeyboardChange(keyboardInput + ' ');
            }
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const [modalActiveValue, setModalActiveValue] = useState(null);

    const handleEditClick = (user) => {
        setModalUser(user);
        setModalActiveValue(user.active);
        setShowModal(true);
    };
    const handleModalCancel = () => {
        setShowModal(false);
        setModalUser(null);
        setModalActiveValue(null);
    };
    const handleModalConfirm = async () => {
        if (!modalUser) return;
        const updatedUser = {
            ...modalUser,
            active: modalActiveValue,
        };
        try {
            await axios.post(
                'https://icontechnik.com/CarServiceMaintenance/api/register/update-user',
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchUsers();
            setShowModal(false);
            setModalUser(null);
            setModalActiveValue(null);
            toast.success('User status updated successfully!');
        } catch (error) {
            toast.error('Failed to update user status.');
        }
    };

    const columns = [
        { name: 'User ID', selector: row => row.userId, sortable: true },
        { name: 'Username', selector: row => row.username, sortable: true },
        { name: 'Role', selector: row => row.userRole, sortable: true },
        {
            name: 'Active', selector: row => row.active ? 'Active' : 'Inactive',
            cell: row => (
                <span className={row.active ? 'text-success' : 'text-danger'}>
                    {row.active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { name: 'Created By', selector: row => row.createdBy },
        { name: 'Created Date', selector: row => row.createdDate && row.createdDate.split('T')[0] },
        {
            name: 'Edit',
            cell: row => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditClick(row)}
                >
                    Edit
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: "transparent",
            },
        },
        cells: {
            style: {
                padding: "8px",
                // border: "1px solid #555",
                textAlign: "center",
            },
        },
        headRow: {
            style: {
                backgroundColor: "#15191F",
                color: "#fff",
                fontSize: "18px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "bold",
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "16px",
                borderBottom: "1px solid #444",
            },
        },
        pagination: {
            style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: "15px"
            },
        },

        pageButtons: {
            style: {
                color: "#fff",
            },
        },
        paginationIcon: {
            style: {
                color: "#fff",
            },
        },
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div
                    className={`col-2 col-md-3 col-lg-2 p-3 ${showOffcanvas ? "d-block" : "d-none d-md-block"}`}
                    style={{
                        height: "auto",
                        minHeight: "100vh",
                        backgroundColor: "#212632",
                    }}
                >
                    <Sidebar />
                </div>
                <div className="col-12 col-md-9 col-lg-10 p-3">
                    <RightSidebar />
                    <h2 className="my-3 text-white">Manage Users</h2>
                    <div className="mb-3" style={{ maxWidth: 400 }}>
                        <input
                            type="text"
                            className="form-control mb-3 input-dashboard text-white placeholder-white"
                            placeholder="Search by username"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onFocus={e => handleInputFocus('searchText', searchText, e.target)}
                            readOnly={showKeyboard}
                            onKeyDown={handlePhysicalKeyDown}
                        />
                    </div>
                    {showKeyboard && (
                        <VirtualKeyboard
                            input={keyboardInput}
                            onChange={handleKeyboardChange}
                            onClose={handleKeyboardClose}
                        />
                    )}
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        progressPending={loading}
                        pagination
                        responsive
                        theme="dark"
                        customStyles={customStyles}
                    />
                </div>
            </div>
            {/* Modal Popup */}
            {showModal && modalUser && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User Status</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleModalCancel}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2"><strong>User ID:</strong> {modalUser.userId}</div>
                                <div className="mb-2"><strong>Username:</strong> {modalUser.username}</div>
                                <div className="mb-2"><strong>Role:</strong> {modalUser.userRole}</div>
                                <div className="mb-2"><strong>Created By:</strong> {modalUser.createdBy}</div>
                                <div className="mb-2"><strong>Created Date:</strong> {modalUser.createdDate && modalUser.createdDate.split('T')[0]}</div>
                                <div className="mb-2">
                                    <strong>Status:</strong>
                                    <select
                                        className="form-select form-select-sm mt-1"
                                        style={{ width: 120, display: 'inline-block', marginLeft: 10 }}
                                        value={modalActiveValue ? 'Active' : 'Inactive'}
                                        onChange={e => setModalActiveValue(e.target.value === 'Active')}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleModalCancel}>Cancel</button>
                                <button className="btn btn-success" onClick={handleModalConfirm}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageUser;