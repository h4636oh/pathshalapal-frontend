import React from 'react';

const TeacherPortal = () => {
	return (
		<div className="container-fluid px-4 py-3">
			<div className="row g-4">
				<div className="col-md-4">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-chalkboard-teacher text-warning fa-3x mb-3"></i>
							<h5 className="card-title">HOMECLASS</h5>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-book text-primary fa-3x mb-3"></i>
							<h5 className="card-title">SUBJECT</h5>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-school text-dark fa-3x mb-3"></i>
							<h5 className="card-title">ADMINISTRATION</h5>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherPortal;
