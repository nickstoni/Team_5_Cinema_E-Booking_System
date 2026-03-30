import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/admin/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!userId || storedRole !== 'ADMIN') {
      navigate('/');
      return;
    }

    setUserRole(storedRole);
    loadDashboardData();
    setLoading(false);
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load dashboard summary
      const dashRes = await fetch('http://localhost:8080/api/admin/dashboard');
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardData(dashData);
      }

      // Load users
      const usersRes = await fetch('http://localhost:8080/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Load movies
      const moviesRes = await fetch('http://localhost:8080/api/admin/movies');
      if (moviesRes.ok) {
        const moviesData = await moviesRes.json();
        setMovies(moviesData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setMessage('Error loading admin data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/status?status=${newStatus}`,
        { method: 'PUT' }
      );

      if (res.ok) {
        setMessage('User status updated successfully');
        loadDashboardData();
      } else {
        setMessage('Error updating user status');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user status');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userRole || userRole !== 'ADMIN') {
    return <div className="error">Access Denied: Admin privileges required</div>;
  }

  return (
    <div className="admin-dashboard">
      <Navbar onSearch={() => {}} onGenreChange={() => {}} />

      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {message && (
            <div className="message">
              {message}
              <span onClick={() => setMessage('')} className="close">×</span>
            </div>
          )}

          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              Movies ({movies.length})
            </button>
          </div>

          {activeTab === 'dashboard' && dashboardData && (
            <div className="dashboard-section">
              <h2>System Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{dashboardData.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <p className="stat-number active">{dashboardData.activeUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Inactive Users</h3>
                  <p className="stat-number inactive">{dashboardData.inactiveUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Movies</h3>
                  <p className="stat-number">{dashboardData.totalMovies}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              {users.length === 0 ? (
                <p>No users found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Email Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.role}</td>
                        <td>
                          {user.emailVerified ? (
                            <span className="verified">✓ Yes</span>
                          ) : (
                            <span className="unverified">✗ No</span>
                          )}
                        </td>
                        <td>
                          {user.status === 'INACTIVE' ? (
                            <button
                              className="action-btn activate"
                              onClick={() => handleUpdateUserStatus(user.userId, 'ACTIVE')}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              className="action-btn deactivate"
                              onClick={() => handleUpdateUserStatus(user.userId, 'INACTIVE')}
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'movies' && (
            <div className="movies-section">
              <h2>Movie Management</h2>
              {movies.length === 0 ? (
                <p>No movies found</p>
              ) : (
                <div className="movies-grid">
                  {movies.map((movie) => (
                    <div key={movie.movieId} className="movie-card-admin">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="movie-poster"
                        onError={(e) =>
                          (e.target.src =
                            'https://via.placeholder.com/200x300?text=No+Image')
                        }
                      />
                      <h3>{movie.title}</h3>
                      <p>Score: {movie.userScore}/100</p>
                      <p>Status: {movie.showAvailability}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
