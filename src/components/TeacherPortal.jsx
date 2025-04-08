import React from 'react';
import { Link } from 'react-router-dom';

const TeacherPortal = () => {
	return (
		<div className="container-fluid px-4 py-4">
			<div className="row g-6 mb-4">
				<Link
					to="/document-generator"
					className="text-decoration-none col"
				>
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-file-alt text-primary fa-3x mb-3"></i>
							<h5 className="card-title">Document Generator</h5>
						</div>
					</div>
				</Link>

				<Link to="/quiz-generator" className="text-decoration-none col">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-question-circle text-success fa-3x mb-3"></i>
							<h5 className="card-title">Quiz Generator</h5>
						</div>
					</div>
				</Link>

				<Link
					to="/schedule-generator"
					className="text-decoration-none col"
				>
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-calendar-alt text-danger fa-3x mb-3"></i>
							<h5 className="card-title">Schedule Generator</h5>
						</div>
					</div>
				</Link>
			</div>
			<div className="row g-4">
				<Link
					to="/lesson-planning"
					className="text-decoration-none col"
				>
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-lightbulb text-warning fa-3x mb-3"></i>
							<h5 className="card-title">Lesson Planning</h5>
						</div>
					</div>
				</Link>

				<Link
					to="/attendance-marking"
					className="text-decoration-none col"
				>
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-user-check text-info fa-3x mb-3"></i>
							<h5 className="card-title">Attendance Marking</h5>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default TeacherPortal;
