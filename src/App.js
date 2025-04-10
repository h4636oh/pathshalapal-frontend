import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DocumentGenerator from './components/DocumentGenerator';
import QuizGenerator from './components/QuizGenerator';
import './App.css';

const App = () => {
	const apiUrl = 'http://localhost:8000';

	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginForm apiUrl={apiUrl} />} />
				<Route path="/dashboard" element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
				} />
				<Route path="/document-generator" element={
						<ProtectedRoute>
							<DocumentGenerator />
						</ProtectedRoute>
				} />
				<Route path="/quiz-generator" element={
						<ProtectedRoute>
							<QuizGenerator />
						</ProtectedRoute>
				} />	
				<Route path="*" element={<Navigate to="/login" replace />} />

			</Routes>
		</Router>
	);
};

export default App;
