import React, { useState, useEffect } from 'react';

// Document Generator Component
export default function DocumentGenerator() {
	// State variables
	const [templates, setTemplates] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState('');
	const [language, setLanguage] = useState('English');
	const [formality, setFormality] = useState('formal');
	const [loading, setLoading] = useState(false);
	const [requiredFields, setRequiredFields] = useState([]);
	const [fieldValues, setFieldValues] = useState({});
	const [generatedDocument, setGeneratedDocument] = useState(null);
	const [error, setError] = useState('');

	// Official languages of India
	const indianLanguages = [
		'Assamese',
		'Bengali',
		'Bodo',
		'Dogri',
		'English',
		'Gujarati',
		'Hindi',
		'Kannada',
		'Kashmiri',
		'Konkani',
		'Maithili',
		'Malayalam',
		'Manipuri',
		'Marathi',
		'Nepali',
		'Odia',
		'Punjabi',
		'Sanskrit',
		'Santali',
		'Sindhi',
		'Tamil',
		'Telugu',
		'Urdu',
	];

	// Formality options
	const formalityOptions = ['formal', 'semi-formal', 'casual'];

	// Fetch templates on component mount
	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				setLoading(true);
				const response = await fetch('http://localhost:8001/api/document_routes/templates');
				if (!response.ok) {
					throw new Error('Failed to fetch templates');
				}
				const data = await response.json();
				setTemplates(data);
				setLoading(false);
			} catch (error) {
				setError('Error fetching templates: ' + error.message);
				setLoading(false);
			}
		};

		fetchTemplates();
	}, []);

	// Update required fields when template changes
	useEffect(() => {
		if (selectedTemplate) {
			const template = templates.find((t) => t.id === selectedTemplate);
			if (template) {
				setRequiredFields(template.required_fields || []);
				// Reset field values when template changes
				const initialValues = {};
				template.required_fields.forEach((field) => {
					initialValues[field.name] = '';
				});
				setFieldValues(initialValues);
			}
		} else {
			setRequiredFields([]);
			setFieldValues({});
		}
	}, [selectedTemplate, templates]);

	// Handle field input changes
	const handleFieldChange = (fieldName, value) => {
		setFieldValues((prev) => ({
			...prev,
			[fieldName]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setGeneratedDocument(null);

		try {
			setLoading(true);

			const requestData = {
				template_type: selectedTemplate,
				language,
				formality,
				details: fieldValues,
			};

			const response = await fetch('http://localhost:8001/api/document_routes/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.detail || 'Failed to generate document'
				);
			}

			const data = await response.json();
			setGeneratedDocument(data);
			setLoading(false);
		} catch (error) {
			setError('Error generating document: ' + error.message);
			setLoading(false);
		}
	};

	// Custom Loading Indicator
	const LoadingIndicator = () => (
		<div className="text-center my-4">
			<div className="progress mb-3">
				<div
					className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					style={{ width: '100%' }}
					aria-valuenow="100"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>
			<p className="text-muted">Generating your document...</p>
		</div>
	);

	return (
		<div className="container py-4">
			<div className="row">
				<div className="col-12">
					<div className="card shadow">
						<div className="card-header bg-primary text-white">
							<h2 className="mb-0">Document Generator</h2>
						</div>
						<div className="card-body">
							{error && (
								<div
									className="alert alert-danger"
									role="alert"
								>
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label
										htmlFor="template"
										className="form-label fw-bold"
									>
										Document Type:
									</label>
									<select
										id="template"
										className="form-select"
										value={selectedTemplate}
										onChange={(e) =>
											setSelectedTemplate(e.target.value)
										}
										required
									>
										<option value="">
											-- Select a Template --
										</option>
										{templates.map((template) => (
											<option
												key={template.id}
												value={template.id}
											>
												{template.name}
											</option>
										))}
									</select>
									{selectedTemplate &&
										templates.find(
											(t) => t.id === selectedTemplate
										)?.description && (
											<div className="form-text text-muted mt-1">
												{
													templates.find(
														(t) =>
															t.id ===
															selectedTemplate
													).description
												}
											</div>
										)}
								</div>

								<div className="mb-3">
									<label
										htmlFor="language"
										className="form-label fw-bold"
									>
										Language:
									</label>
									<select
										id="language"
										className="form-select"
										value={language}
										onChange={(e) =>
											setLanguage(e.target.value)
										}
										required
									>
										{indianLanguages.map((lang) => (
											<option key={lang} value={lang}>
												{lang}
											</option>
										))}
									</select>
								</div>

								<div className="mb-3">
									<label
										htmlFor="formality"
										className="form-label fw-bold"
									>
										Document Tone:
									</label>
									<select
										id="formality"
										className="form-select"
										value={formality}
										onChange={(e) =>
											setFormality(e.target.value)
										}
										required
									>
										{formalityOptions.map((option) => (
											<option key={option} value={option}>
												{option
													.charAt(0)
													.toUpperCase() +
													option.slice(1)}
											</option>
										))}
									</select>
								</div>

								{selectedTemplate && (
									<div className="card mb-3">
										<div className="card-header bg-light">
											<h5 className="mb-0">
												Required Information
											</h5>
										</div>
										<div className="card-body">
											{requiredFields.length > 0 ? (
												requiredFields.map((field) => (
													<div
														className="mb-3"
														key={field.name}
													>
														<label
															htmlFor={field.name}
															className="form-label fw-bold"
														>
															{field.description ||
																field.name}
															:
														</label>
														<input
															type="text"
															className="form-control"
															id={field.name}
															value={
																fieldValues[
																	field.name
																] || ''
															}
															onChange={(e) =>
																handleFieldChange(
																	field.name,
																	e.target
																		.value
																)
															}
															required
														/>
													</div>
												))
											) : (
												<p className="text-muted">
													This template doesn't
													require any additional
													fields.
												</p>
											)}
										</div>
									</div>
								)}

								<div className="d-grid">
									<button
										type="submit"
										className="btn btn-primary btn-lg"
										disabled={loading || !selectedTemplate}
									>
										{loading
											? 'Generating...'
											: 'Generate Document'}
									</button>
								</div>
							</form>

							{loading && <LoadingIndicator />}

							{generatedDocument && (
								<div className="mt-4">
									<div className="card">
										<div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
											<h4 className="mb-0">
												Generated Document
											</h4>
											<button
												className="btn btn-sm btn-light"
												onClick={() => {
													const blob = new Blob(
														[
															generatedDocument.content,
														],
														{ type: 'text/plain' }
													);
													const url =
														URL.createObjectURL(
															blob
														);
													const a =
														document.createElement(
															'a'
														);
													a.href = url;
													a.download = `${generatedDocument.template_used}_${generatedDocument.language}.txt`;
													a.click();
												}}
											>
												Download
											</button>
										</div>
										<div className="card-body">
											<div className="mb-3">
												<div className="badge bg-primary me-2">
													Template:{' '}
													{
														generatedDocument
															.metadata
															.template_name
													}
												</div>
												<div className="badge bg-secondary me-2">
													Language:{' '}
													{generatedDocument.language}
												</div>
												<div className="badge bg-info">
													Tone:{' '}
													{
														generatedDocument.formality
													}
												</div>
											</div>

											<div className="p-3 bg-light border rounded">
												<pre
													className="mb-0"
													style={{
														whiteSpace: 'pre-wrap',
														fontFamily: 'inherit',
													}}
												>
													{generatedDocument.content}
												</pre>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
