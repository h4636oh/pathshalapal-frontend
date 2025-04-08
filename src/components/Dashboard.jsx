import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParentPortal from './ParentPortal';
import TeacherPortal from './TeacherPortal';

const Dashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is logged in
		const storedUser = localStorage.getItem('user');
		const token = localStorage.getItem('token');

		if (!storedUser || !token) {
			navigate('/login');
			return;
		}

		try {
			const userData = JSON.parse(storedUser);
			setUser(userData);
		} catch (error) {
			console.error('Failed to parse user data', error);
			navigate('/login');
		} finally {
			setLoading(false);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/login');
	};

	if (loading) {
		return (
			<div
				className="d-flex justify-content-center align-items-center"
				style={{ height: '100vh' }}
			>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container" style={{ maxWidth: '900px' }}>
			<div
				className="card mt-4 shadow-sm"
				style={{ borderRadius: '16px', overflow: 'hidden' }}
			>
				{/* Header with user icon for logout */}
				<div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
					<h5 className="m-0">
						{user?.usertype === 'teacher'
							? "TEACHER'S PORTAL"
							: 'PARENTS PORTAL'}
					</h5>
					<button
						className="btn btn-link text-white"
						onClick={handleLogout}
						style={{ fontSize: '1.5rem' }}
					>
						<i class="fa-solid fa-right-from-bracket"></i>{' '}
					</button>
				</div>

				{/* Conditional rendering based on user type */}
				<div className="card-body p-0">
					{user?.usertype === 'teacher' ? (
						<TeacherPortal />
					) : (
						<ParentPortal />
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
