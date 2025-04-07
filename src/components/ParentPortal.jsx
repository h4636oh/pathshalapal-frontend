import React from 'react';

const ParentPortal = () => {
	return (
		<div className="container-fluid px-4 py-3">
			<div className="row g-4">
				<div className="col-md-6">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-file-alt text-warning fa-3x mb-3"></i>
							<h5 className="card-title">DOCUMENTS</h5>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-medal text-danger fa-3x mb-3"></i>
							<h5 className="card-title">RESULTS</h5>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-user-friends text-success fa-3x mb-3"></i>
							<h5 className="card-title">ATTENDENCE</h5>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card text-center h-100">
						<div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
							<i className="fas fa-phone-alt text-success fa-3x mb-3"></i>
							<h5 className="card-title">CONTACT TEACHER</h5>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ParentPortal;
