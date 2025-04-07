import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem('token');
			const user = localStorage.getItem('user');

			if (!token || !user) {
				setIsAuthenticated(false);
				navigate('/login');
				return;
			}

			setIsAuthenticated(true);
		};

		checkAuth();
	}, [navigate]);

	if (isAuthenticated === null) {
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

	return isAuthenticated ? children : null;
};

export default ProtectedRoute;
