import React, { useState } from 'react';

const UserManagement = () => {
    // Initial employee state
    const [employees, setEmployees] = useState([
        { id: 'EMP-2026-001', name: 'Andi Pratama', email: 'andi.p@laundryinaja.com', role: 'CASHIER', status: 'ACTIVE', initials: 'AP' },
        { id: 'EMP-2026-002', name: 'Rizky Saputra', email: 'rizky.s@laundryinaja.com', role: 'CASHIER', status: 'ACTIVE', initials: 'RS' },
        { id: 'EMP-2026-003', name: 'Fajar Nugroho', email: 'fajar.n@laundryinaja.com', role: 'CASHIER', status: 'INACTIVE', initials: 'FN' },
        { id: 'EMP-2026-000', name: 'Dwi Lestari', email: 'dwi.l@laundryinaja.com', role: 'ADMINISTRATOR', status: 'ACTIVE', initials: 'DL' }
    ]);

    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Form fields for new employee
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('CASHIER');

    const handleAddEmployee = (e) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) return;

        const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const newId = `EMP-2026-0${employees.length + 1}`;
        const newEmp = {
            id: newId,
            name: newName,
            email: newEmail,
            role: newRole,
            status: 'ACTIVE',
            initials: initials
        };

        setEmployees([...employees, newEmp]);
        setNewName('');
        setNewEmail('');
        setNewRole('CASHIER');
        setShowAddModal(false);
    };

    const handleDeleteEmployee = (id) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus karyawan dengan ID ${id}?`)) {
            setEmployees(employees.filter(emp => emp.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setEmployees(employees.map(emp => 
            emp.id === id 
                ? { ...emp, status: emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } 
                : emp
        ));
    };

    // Derived statistics
    const totalAdmin = employees.filter(emp => emp.role === 'ADMINISTRATOR').length;
    const totalCashier = employees.filter(emp => emp.role === 'CASHIER').length;
    const totalOperations = employees.filter(emp => emp.role === 'OPERATIONS' || emp.role === 'CASHIER').length; // Mock formula matching screen
    const activeCount = employees.filter(emp => emp.status === 'ACTIVE').length;

    // Filtered list
    const filteredEmployees = employees.filter(emp => {
        const matchesRole = roleFilter === 'All Roles' || emp.role === roleFilter.toUpperCase();
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              emp.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Employee Name,Employee ID,Email Address,System Role,Account Status\n";
        employees.forEach(emp => {
            csvContent += `"${emp.name}","${emp.id}","${emp.email}","${emp.role}","${emp.status}"\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "laundry_employee_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>User Management</h1>
                    <p>Kelola data karyawan dan hak akses sistem.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                        padding: '10px 20px',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '24px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" x2="19" y1="8" y2="14" />
                        <line x1="16" x2="22" y1="11" y2="11" />
                    </svg>
                    Add New User
                </button>
            </div>

            {/* Quick Stats Grid matching User Management design */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="metric-card" style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}>
                    <div className="metric-info">
                        <span className="metric-label" style={{ color: '#93c5fd', fontSize: '11px', letterSpacing: '0.5px' }}>TOTAL ADMIN</span>
                        <span className="metric-value" style={{ color: '#ffffff', fontSize: '26px' }}>{totalAdmin}</span>
                    </div>
                    <div className="metric-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card orange">
                    <div className="metric-info">
                        <span className="metric-label" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>TOTAL CASHIER</span>
                        <span className="metric-value" style={{ fontSize: '26px' }}>{totalCashier}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card purple">
                    <div className="metric-info">
                        <span className="metric-label" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>OPERATIONS</span>
                        <span className="metric-value" style={{ fontSize: '26px' }}>{totalOperations}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card green">
                    <div className="metric-info">
                        <span className="metric-label" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>ACTIVE NOW</span>
                        <span className="metric-value" style={{ fontSize: '26px' }}>{activeCount}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m12 14 4-4" />
                            <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                        </svg> {/* <--- DI SINI SUDAH DIPERBAIKI (Tadinya </g>) */}
                    </div>
                </div>
            </div>

            {/* Employee List Section */}
            <div className="table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="table-title" style={{ fontSize: '16px', fontWeight: '600' }}>Employee List</span>
                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                            {filteredEmployees.length} Total
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Search in user management */}
                        <div className="search-bar-container" style={{ width: '220px', margin: 0 }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px' }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search employees..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ padding: '8px 12px 8px 34px', fontSize: '13px', borderRadius: '18px' }}
                            />
                        </div>
                        
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '18px',
                                border: '1px solid var(--border-color)',
                                fontSize: '13px',
                                outline: 'none',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                fontWeight: '500'
                            }}
                        >
                            <option value="All Roles">All Roles</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Cashier">Cashier</option>
                        </select>
                        <button 
                            onClick={exportToCSV}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                background: '#f8fafc',
                                border: '1px solid var(--border-color)',
                                borderRadius: '18px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>EMPLOYEE NAME</th>
                                <th>EMPLOYEE ID</th>
                                <th>EMAIL ADDRESS</th>
                                <th>SYSTEM ROLE</th>
                                <th>ACCOUNT STATUS</th>
                                <th style={{ textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div 
                                                style={{ 
                                                    width: '36px', 
                                                    height: '36px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: emp.role === 'ADMINISTRATOR' ? '#dbeafe' : '#ede9fe', 
                                                    color: emp.role === 'ADMINISTRATOR' ? '#2563eb' : '#8b5cf6', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontWeight: '600',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                {emp.initials}
                                            </div>
                                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{emp.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>{emp.id}</td>
                                    <td>{emp.email}</td>
                                    <td>
                                        <span 
                                            style={{ 
                                                fontSize: '11px', 
                                                padding: '4px 10px', 
                                                borderRadius: '6px', 
                                                fontWeight: '700', 
                                                background: emp.role === 'ADMINISTRATOR' ? '#dbeafe' : '#f3f4f6', 
                                                color: emp.role === 'ADMINISTRATOR' ? '#2563eb' : '#4b5563',
                                                letterSpacing: '0.3px'
                                            }}
                                        >
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}>
                                            <span 
                                                style={{ 
                                                    width: '8px', 
                                                    height: '8px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: emp.status === 'ACTIVE' ? '#10b981' : '#9ca3af' 
                                                }}
                                            />
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button 
                                                onClick={() => toggleStatus(emp.id)}
                                                style={{ 
                                                    padding: '4px 10px', 
                                                    borderRadius: '12px', 
                                                    background: '#f1f5f9', 
                                                    border: 'none', 
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: 'var(--text-main)'
                                                }}
                                                title="Toggle status Active/Inactive"
                                            >
                                                Toggle Status
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteEmployee(emp.id)}
                                                style={{ 
                                                    padding: '4px', 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    cursor: 'pointer',
                                                    color: '#ef4444'
                                                }}
                                                title="Delete employee"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'left' }}>
                        <h3 className="modal-title" style={{ marginBottom: '16px', fontSize: '18px' }}>Add New Employee</h3>
                        <form onSubmit={handleAddEmployee}>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Name</label>
                                <input 
                                    type="text" 
                                    value={newName} 
                                    onChange={(e) => setNewName(e.target.value)} 
                                    className="form-input" 
                                    required 
                                    placeholder="Enter employee name"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Email</label>
                                <input 
                                    type="email" 
                                    value={newEmail} 
                                    onChange={(e) => setNewEmail(e.target.value)} 
                                    className="form-input" 
                                    required 
                                    placeholder="Enter email address"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>System Role</label>
                                <select 
                                    value={newRole} 
                                    onChange={(e) => setNewRole(e.target.value)} 
                                    className="form-input"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                >
                                    <option value="CASHIER">CASHIER</option>
                                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                                    <option value="OPERATIONS">OPERATIONS</option>
                                </select>
                            </div>
                            <div className="modal-buttons" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                                <button type="button" className="modal-btn no" onClick={() => setShowAddModal(false)} style={{ width: 'auto', padding: '10px 20px' }}>Cancel</button>
                                <button type="submit" className="modal-btn yes" style={{ width: 'auto', padding: '10px 20px', background: '#2563eb' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;