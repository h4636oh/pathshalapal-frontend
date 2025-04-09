import { useState, useRef } from 'react';

export default function QuizGenerator() {
	// Form state
	const [formData, setFormData] = useState({
		subject: 'maths',
		grade: '5',
		topic: '',
		questionTypes: [],
		numQuestions: 10,
		difficultyDist: {
			easy: 33,
			medium: 34,
			hard: 33,
		},
		bloomDist: {
			remembering: 20,
			understanding: 20,
			applying: 20,
			analyzing: 15,
			evaluating: 15,
			creating: 10,
		},
		context: '',
	});

	const [pdfFile, setPdfFile] = useState(null);
	const [pdfText, setPdfText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [generatedQuiz, setGeneratedQuiz] = useState(null);
	const [suggestedTopics, setSuggestedTopics] = useState([]);
	const fileInputRef = useRef(null);

	// Question type options
	const questionTypeOptions = [
		'mcq',
		'short answer',
		'long answer',
		'fill in the blanks',
		'match the following',
		'true/false',
	];

	// Subject options
	const subjectOptions = ['maths', 'science', 'social science', 'english'];

	// Grade options
	const gradeOptions = ['5', '6', '7', '8'];

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Fetch suggested topics when subject or grade changes
		if (name === 'subject' || name === 'grade') {
			fetchSuggestedTopics(
				name === 'subject' ? value : formData.subject,
				name === 'grade' ? value : formData.grade
			);
		}
	};

	// Handle question type changes
	const handleQuestionTypeChange = (type) => {
		const updatedTypes = formData.questionTypes.includes(type)
			? formData.questionTypes.filter((t) => t !== type)
			: [...formData.questionTypes, type];

		setFormData({ ...formData, questionTypes: updatedTypes });
	};

	// Handle number of questions change
	const handleNumQuestionsChange = (e) => {
		setFormData({ ...formData, numQuestions: parseInt(e.target.value) });
	};

	// Handle difficulty distribution changes
	const handleDifficultyChange = (level, value) => {
		const newValue = parseInt(value);
		const otherLevels = Object.keys(formData.difficultyDist).filter(
			(l) => l !== level
		);

		// Calculate remaining percentage
		const remaining = 100 - newValue;

		// Distribute remaining proportionally between other levels
		const currentOtherSum = otherLevels.reduce(
			(sum, l) => sum + formData.difficultyDist[l],
			0
		);
		const newDifficultyDist = {
			...formData.difficultyDist,
			[level]: newValue,
		};

		if (currentOtherSum > 0) {
			otherLevels.forEach((l) => {
				const proportion = formData.difficultyDist[l] / currentOtherSum;
				newDifficultyDist[l] = Math.round(remaining * proportion);
			});
		} else {
			// Distribute equally if other levels are zero
			otherLevels.forEach((l) => {
				newDifficultyDist[l] = Math.round(
					remaining / otherLevels.length
				);
			});
		}

		// Fix rounding errors
		const sum = Object.values(newDifficultyDist).reduce((a, b) => a + b, 0);
		if (sum !== 100) {
			const diff = 100 - sum;
			newDifficultyDist[otherLevels[0]] += diff;
		}

		setFormData({ ...formData, difficultyDist: newDifficultyDist });
	};

	// Handle Bloom's taxonomy distribution changes
	const handleBloomChange = (category, value) => {
		const newValue = parseInt(value);
		const otherCategories = Object.keys(formData.bloomDist).filter(
			(c) => c !== category
		);

		// Calculate remaining percentage
		const remaining = 100 - newValue;

		// Distribute remaining proportionally between other categories
		const currentOtherSum = otherCategories.reduce(
			(sum, c) => sum + formData.bloomDist[c],
			0
		);
		const newBloomDist = { ...formData.bloomDist, [category]: newValue };

		if (currentOtherSum > 0) {
			otherCategories.forEach((c) => {
				const proportion = formData.bloomDist[c] / currentOtherSum;
				newBloomDist[c] = Math.round(remaining * proportion);
			});
		} else {
			// Distribute equally if other categories are zero
			otherCategories.forEach((c) => {
				newBloomDist[c] = Math.round(
					remaining / otherCategories.length
				);
			});
		}

		// Fix rounding errors
		const sum = Object.values(newBloomDist).reduce((a, b) => a + b, 0);
		if (sum !== 100) {
			const diff = 100 - sum;
			newBloomDist[otherCategories[0]] += diff;
		}

		setFormData({ ...formData, bloomDist: newBloomDist });
	};

	// Handle PDF upload
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setPdfFile(file);
		setIsLoading(true);

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('http://localhost:8001/process-pdf', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to process PDF');
			}

			const data = await response.json();
			setPdfText(data.text);
			setFormData((prevState) => ({
				...prevState,
				context: prevState.context + '\n' + data.text,
			}));
		} catch (error) {
			console.error('Error processing PDF:', error);
			alert('Failed to process PDF');
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch suggested topics
	const fetchSuggestedTopics = async (subject, grade) => {
		try {
			const response = await fetch(
				'http://localhost:8001/suggest-topics',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ subject, grade }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch topics');
			}

			const data = await response.json();
			setSuggestedTopics(data.topics);
		} catch (error) {
			console.error('Error fetching topics:', error);
			setSuggestedTopics([]);
		}
	};

	// Generate quiz
	const handleGenerateQuiz = async () => {
		if (!formData.topic) {
			alert('Please enter a topic');
			return;
		}

		if (formData.questionTypes.length === 0) {
			alert('Please select at least one question type');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(
				'http://localhost:8001/generate-questions',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						subject: formData.subject,
						grade: formData.grade,
						topic: formData.topic,
						question_types: formData.questionTypes,
						num_questions: formData.numQuestions,
						difficulty_dist: formData.difficultyDist,
						bloom_dist: formData.bloomDist,
						context: formData.context,
					}),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to generate quiz');
			}

			const data = await response.json();
			setGeneratedQuiz(data.questions);
		} catch (error) {
			console.error('Error generating quiz:', error);
			alert('Failed to generate quiz');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-5">
			<h1 className="text-center mb-4">Interactive Quiz Generator</h1>

			<div className="card shadow mb-5">
				<div className="card-body">
					<div className="row mb-3">
						{/* Subject Selection */}
						<div className="col-md-6 mb-3">
							<label className="form-label">Subject</label>
							<select
								name="subject"
								value={formData.subject}
								onChange={handleInputChange}
								className="form-select"
							>
								{subjectOptions.map((option) => (
									<option key={option} value={option}>
										{option.charAt(0).toUpperCase() +
											option.slice(1)}
									</option>
								))}
							</select>
						</div>

						{/* Grade Selection */}
						<div className="col-md-6 mb-3">
							<label className="form-label">Grade/Class</label>
							<select
								name="grade"
								value={formData.grade}
								onChange={handleInputChange}
								className="form-select"
							>
								{gradeOptions.map((option) => (
									<option key={option} value={option}>
										Class {option}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Topic Input */}
					<div className="mb-3">
						<label className="form-label">Topic</label>
						<input
							type="text"
							name="topic"
							value={formData.topic}
							onChange={handleInputChange}
							placeholder="Enter the topic for your quiz"
							className="form-control"
						/>

						{/* Suggested Topics */}
						{suggestedTopics.length > 0 && (
							<div className="mt-2">
								<p className="text-muted small mb-1">
									Suggested topics:
								</p>
								<div className="d-flex flex-wrap gap-1">
									{suggestedTopics.map((topic, index) => (
										<button
											key={index}
											type="button"
											onClick={() =>
												setFormData({
													...formData,
													topic,
												})
											}
											className="btn btn-sm btn-light"
										>
											{topic}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Question Types */}
					<div className="mb-4">
						<label className="form-label">
							Question Types (select multiple)
						</label>
						<div className="row">
							{questionTypeOptions.map((type) => (
								<div
									key={type}
									className="col-md-4 col-sm-6 mb-2"
								>
									<div className="form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id={`type-${type}`}
											checked={formData.questionTypes.includes(
												type
											)}
											onChange={() =>
												handleQuestionTypeChange(type)
											}
										/>
										<label
											className="form-check-label"
											htmlFor={`type-${type}`}
										>
											{type.charAt(0).toUpperCase() +
												type.slice(1)}
										</label>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Number of Questions */}
					<div className="mb-4">
						<label className="form-label">
							Number of Questions: {formData.numQuestions}
						</label>
						<input
							type="range"
							className="form-range"
							min="5"
							max="50"
							value={formData.numQuestions}
							onChange={handleNumQuestionsChange}
						/>
						<div className="d-flex justify-content-between">
							<small className="text-muted">5</small>
							<small className="text-muted">50</small>
						</div>
					</div>

					{/* Difficulty Distribution */}
					<div className="mb-4">
						<label className="form-label">
							Difficulty Distribution (Total: 100%)
						</label>
						<div className="mb-3">
							{Object.entries(formData.difficultyDist).map(
								([level, percentage]) => (
									<div key={level} className="mb-3">
										<div className="d-flex justify-content-between align-items-center mb-1">
											<span className="text-capitalize">
												{level}
											</span>
											<span className="badge bg-secondary">
												{percentage}%
											</span>
										</div>
										<input
											type="range"
											className="form-range"
											min="0"
											max="100"
											value={percentage}
											onChange={(e) =>
												handleDifficultyChange(
													level,
													e.target.value
												)
											}
										/>
									</div>
								)
							)}
						</div>
					</div>

					{/* Bloom's Taxonomy */}
					<div className="mb-4">
						<label className="form-label">
							Bloom's Taxonomy Distribution (Total: 100%)
						</label>
						<div>
							{Object.entries(formData.bloomDist).map(
								([category, percentage]) => (
									<div key={category} className="mb-3">
										<div className="d-flex justify-content-between align-items-center mb-1">
											<span className="text-capitalize">
												{category}
											</span>
											<span className="badge bg-secondary">
												{percentage}%
											</span>
										</div>
										<input
											type="range"
											className="form-range"
											min="0"
											max="100"
											value={percentage}
											onChange={(e) =>
												handleBloomChange(
													category,
													e.target.value
												)
											}
										/>
									</div>
								)
							)}
						</div>
					</div>

					{/* PDF Upload */}
					<div className="mb-4">
						<label className="form-label">
							Upload PDF for Context (optional)
						</label>
						<div className="card border-dashed">
							<div
								className="card-body text-center py-5"
								onClick={() => fileInputRef.current.click()}
								style={{ cursor: 'pointer' }}
							>
								<i className="bi bi-upload fs-1 text-muted mb-2"></i>
								<p className="mb-1">
									Click to upload or drag and drop
								</p>
								<p className="small text-muted">
									PDF files only
								</p>
								<input
									ref={fileInputRef}
									type="file"
									accept=".pdf"
									onChange={handleFileUpload}
									className="d-none"
								/>
							</div>
						</div>
						{pdfFile && (
							<div className="mt-2 d-flex align-items-center text-muted small">
								<i className="bi bi-file-pdf me-2"></i>
								<span className="text-truncate">
									{pdfFile.name}
								</span>
							</div>
						)}
					</div>

					{/* Additional Context */}
					<div className="mb-4">
						<label className="form-label">
							Additional Context (optional)
						</label>
						<textarea
							name="context"
							value={formData.context}
							onChange={handleInputChange}
							placeholder="Enter any additional context or information that should be considered when generating questions"
							className="form-control"
							rows="5"
						/>
					</div>

					{/* Generate Button */}
					<div className="d-grid">
						<button
							onClick={handleGenerateQuiz}
							disabled={isLoading}
							className="btn btn-primary py-2"
						>
							{isLoading ? (
								<>
									<span
										className="spinner-border spinner-border-sm me-2"
										role="status"
										aria-hidden="true"
									></span>
									Processing...
								</>
							) : (
								'Generate Quiz'
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Generated Quiz Results */}
			{generatedQuiz && (
				<div className="card shadow">
					<div className="card-body">
						<h2 className="card-title mb-4">Generated Quiz</h2>
						<div className="quiz-content">
							{generatedQuiz.map((question, index) => (
								<div
									key={index}
									className="border-bottom pb-3 mb-3"
								>
									<p className="fw-bold">
										Question {index + 1}: {question.text}
									</p>
									<p className="small text-muted">
										Type: {question.type} | Difficulty:{' '}
										{question.difficulty} | Bloom:{' '}
										{question.bloom_category}
									</p>

									{question.type === 'mcq' &&
										question.options && (
											<div className="ms-4 mt-2">
												{question.options.map(
													(option, optIndex) => (
														<div
															key={optIndex}
															className="d-flex align-items-start mt-1"
														>
															<div
																className={`badge rounded-pill me-2 ${
																	option ===
																	question.answer
																		? 'bg-success'
																		: 'bg-light text-dark'
																}`}
															>
																{String.fromCharCode(
																	65 +
																		optIndex
																)}
															</div>
															<p className="mb-1">
																{option}
															</p>
														</div>
													)
												)}
											</div>
										)}

									{question.type !== 'mcq' &&
										question.answer && (
											<div className="mt-2">
												<p className="mb-0">
													<span className="fw-bold">
														Answer:
													</span>{' '}
													{question.answer}
												</p>
											</div>
										)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
