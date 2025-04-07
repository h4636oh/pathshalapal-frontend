import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ apiUrl }) => {
	const navigate = useNavigate();
	const [userType, setUserType] = useState('parent');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`${apiUrl}/user/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					type: userType,
					username,
					password,
				}),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const data = await response.json();

			// Store the JWT token and user in localStorage
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			// Redirect to dashboard after successful login
			navigate('/dashboard');
		} catch (err) {
			setError(err.message || 'Failed to login. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: '100vh' }}
		>
			<div
				className="card shadow-sm"
				style={{
					maxWidth: '400px',
					backgroundColor: '#f0f0f0',
					borderRadius: '16px',
				}}
			>
				<div className="card-body p-4">
					{/* User Type Toggle */}
					<div className="btn-group w-100 mb-4">
						<button
							type="button"
							className={`btn ${
								userType === 'parent'
									? 'btn-primary'
									: 'btn-secondary'
							}`}
							onClick={() => setUserType('parent')}
						>
							PARENTS
						</button>
						<button
							type="button"
							className={`btn ${
								userType === 'teacher'
									? 'btn-primary'
									: 'btn-secondary'
							}`}
							onClick={() => setUserType('teacher')}
						>
							TEACHERS
						</button>
					</div>

					<form onSubmit={handleLogin}>
						{/* Username Field */}
						<div className="input-group mb-3">
							<span className="input-group-text bg-white">
								<i className="fas fa-user text-primary"></i>
							</span>
							<input
								type="text"
								className="form-control"
								placeholder="USERNAME"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						{/* Password Field */}
						<div className="input-group mb-4">
							<span className="input-group-text bg-white">
								<i className="fas fa-key text-primary"></i>
							</span>
							<input
								type="password"
								className="form-control"
								placeholder="PASSWORD"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{/* Error Message */}
						{error && (
							<div className="alert alert-danger" role="alert">
								{error}
							</div>
						)}

						{/* Login Button */}
						<button
							type="submit"
							className="btn btn-primary w-100 py-2"
							disabled={loading}
						>
							{loading ? 'LOGGING IN...' : 'LOGIN IN'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
