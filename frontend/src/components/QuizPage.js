import React, { useEffect, useState } from 'react';
import './QuizPage.css';
import './Navbar.css';

const QuizPage = ({ onPageChange, theme, toggleTheme }) => {
  // Define questions first so we can size state based on length
  const questions = [
    { id: 1,  text: "I learn best when I see diagrams or charts.",                   type: 'Visual',      leftLabel: 'Prefers Diagrams',            rightLabel: 'Visual' },
    { id: 2,  text: "I like listening to explanations or lectures.",                   type: 'Auditory',    leftLabel: 'Likes Listening',             rightLabel: 'Auditory' },
    { id: 3,  text: "I enjoy reading textbooks or study materials.",                   type: 'Read/Write',  leftLabel: 'Enjoys Reading',              rightLabel: 'Read/Write' },
    { id: 4,  text: "I learn best through hands-on activities.",                      type: 'Kinesthetic', leftLabel: 'HandsOn Activities',          rightLabel: 'Kinesthetic' },
    { id: 5,  text: "I remember information better when I see pictures.",             type: 'Visual',      leftLabel: 'Remembers Pictures',          rightLabel: 'Visual' },
    { id: 6,  text: "I prefer listening to lectures or talks.",                       type: 'Auditory',    leftLabel: 'Prefers Lectures',            rightLabel: 'Auditory' },
    { id: 7,  text: "I like taking notes to understand better.",                      type: 'Read/Write',  leftLabel: 'Writes Notes',                rightLabel: 'Read/Write' },
    { id: 8,  text: "I like building models or projects.",                            type: 'Kinesthetic', leftLabel: 'Builds Models',               rightLabel: 'Kinesthetic' },
    { id: 9,  text: "I learn well from watching videos.",                             type: 'Visual',      leftLabel: 'Watches Videos',              rightLabel: 'Visual' },
    { id: 10, text: "I enjoy participating in group discussions.",                    type: 'Auditory',    leftLabel: 'Participates Discussions',    rightLabel: 'Auditory' },
    { id: 11, text: "I like reading textbooks or articles.",                          type: 'Read/Write',  leftLabel: 'Reads Textbooks',             rightLabel: 'Read/Write' },
    { id: 12, text: "I enjoy performing experiments or practicals.",                  type: 'Kinesthetic', leftLabel: 'Does Experiments',            rightLabel: 'Kinesthetic' },
    { id: 13, text: "I like drawing mind maps or diagrams.",                          type: 'Visual',      leftLabel: 'Draws Mindmaps',              rightLabel: 'Visual' },
    { id: 14, text: "I like listening to music while studying.",                      type: 'Auditory',    leftLabel: 'Listens MusicWhileStudying', rightLabel: 'Auditory' },
    { id: 15, text: "I often move around while learning.",                            type: 'Kinesthetic', leftLabel: 'Moves WhileLearning',         rightLabel: 'Kinesthetic' },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendResult, setBackendResult] = useState(null);
  // Pre-quiz user details
  const [showPreQuizForm, setShowPreQuizForm] = useState(true);
  const [preQuizData, setPreQuizData] = useState({
    name: '',
    email: '',
    age: '',
    age_group: '',
    gender: '',
    education: '',
    preferred_study_time: '',
    learning_goal: '',
    language_preference: ''
  });

  // Resume progress from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('quizProgress');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.inProgress) {
          if (Array.isArray(saved.answers)) setAnswers(saved.answers);
          if (typeof saved.currentQuestion === 'number') setCurrentQuestion(saved.currentQuestion);
          if (typeof saved.showPreQuizForm === 'boolean') setShowPreQuizForm(saved.showPreQuizForm);
          if (saved.preQuizData) setPreQuizData(prev => ({ ...prev, ...saved.preQuizData }));
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist progress to localStorage whenever key state changes
  useEffect(() => {
    const payload = {
      inProgress: !showResult,
      currentQuestion,
      answers,
      showPreQuizForm,
      preQuizData,
      ts: Date.now(),
    };
    try { localStorage.setItem('quizProgress', JSON.stringify(payload)); } catch {}
  }, [currentQuestion, answers, showPreQuizForm, preQuizData, showResult]);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const calculateResult = async () => {
    // Local tally (optional)
    const scores = { Visual: 0, Auditory: 0, 'Read/Write': 0, Kinesthetic: 0 };
    // Ensure all answers are provided
    if (answers.some((a) => a === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }
    answers.forEach((answer, index) => {
      if (answer !== null) scores[questions[index].type] += answer;
    });

    // Build payload expected by backend Flask API (/quiz/attempt)
    const toNumber = (v) => (v === '' || v == null ? null : Number(v));
    const payload = {
      // Optional identity for anonymous users (backend will prefer cookie session if available)
      name: preQuizData.name || undefined,
      email: preQuizData.email || undefined,
      Age: toNumber(preQuizData.age),
      Age_Group: preQuizData.age_group,
      Gender: preQuizData.gender,
      Education_Level: preQuizData.education,
      Preferred_Study_Time: preQuizData.preferred_study_time,
      Learning_Goal: preQuizData.learning_goal,
      Language_Preference: preQuizData.language_preference,
      // Likert responses mapped from answers array (1-5)
      Prefers_Diagrams: answers[0],
      Likes_Listening: answers[1],
      Enjoys_Reading: answers[2],
      HandsOn_Activities: answers[3],
      Remembers_Pictures: answers[4],
      Prefers_Lectures: answers[5],
      Writes_Notes: answers[6],
      Builds_Models: answers[7],
      Watches_Videos: answers[8],
      Participates_Discussions: answers[9],
      Reads_Textbooks: answers[10],
      Does_Experiments: answers[11],
      Draws_Mindmaps: answers[12],
      Listens_MusicWhileStudying: answers[13],
      Moves_WhileLearning: answers[14],
      model_type: 'random_forest',
    };

    try {
      setLoading(true);
      setError('');
      const res = await fetch('/quiz/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Prediction failed');
      }
      const data = await res.json();
      setBackendResult(data && data.data ? data.data : null);
      setShowResult(true);
    } catch (e) {
      console.error('Predict error', e);
      setError(e.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePreQuizChange = (e) => {
    const { name, value } = e.target;
    setPreQuizData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePreQuiz = () => {
    const { age, age_group, gender, education, preferred_study_time, learning_goal, language_preference } = preQuizData;
    if (!age || Number(age) <= 0) return false;
    return [age_group, gender, education, preferred_study_time, learning_goal, language_preference]
      .every((v) => v && v.length > 0);
  };

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (!validatePreQuiz()) {
      alert('Please fill all fields before starting the quiz.');
      return;
    }
    console.log('Pre-Quiz Details:', preQuizData);
    setShowPreQuizForm(false);
  };

  if (showResult) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <h2 style={{ textAlign: 'center' }}>Quiz Completed! 🎉</h2>
          {backendResult ? (
            <div className="result-section">
              <div className="result-header">
                <div className="result-title">Your Result Summary</div>
                <div className="stat-badges">
                  <span className="badge">Name: {backendResult.name}</span>
                  <span className="badge">Email: {backendResult.email}</span>
                  <span className="badge">Attempts: {backendResult.totalAttempts}</span>
                </div>
              </div>

              {Array.isArray(backendResult.attempts) && backendResult.attempts.length > 0 && (
                (() => {
                  const latest = backendResult.attempts[backendResult.attempts.length - 1];
                  const modelData = latest.modelResult || {};
                  const rf = modelData.random_forest || {};
                  return (
                    <div className="result-card">
                      <h4>Latest Attempt</h4>
                      <div className="stat-badges" style={{ marginBottom: '.5rem' }}>
                        <span className="badge">Learning Style: {latest.learningStyle || rf.prediction}</span>
                        <span className="badge">Submitted: {new Date(latest.submittedAt).toLocaleString()}</span>
                        {typeof rf.confidence !== 'undefined' && (
                          <span className="badge">Confidence: {(rf.confidence * 100).toFixed(1)}%</span>
                        )}
                      </div>
                      {rf.probabilities && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div className="section-label">Class Probabilities</div>
                          <ul className="probability-list">
                            {Object.entries(rf.probabilities).map(([label, prob]) => (
                              <li key={label}>{label}: {(prob * 100).toFixed(1)}%</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div style={{ marginTop: '0.5rem' }}>
                        <div className="section-label">Description</div>
                        {rf.description && (
                          <>
                            <div className="muted" style={{ marginBottom: '0.5rem' }}>
                              {typeof rf.description === 'string' ? rf.description : rf.description.description}
                            </div>
                            {rf.description.characteristics && rf.description.characteristics.length > 0 && (
                              <div style={{ marginTop: '0.5rem' }}>
                                <div className="section-label">Characteristics</div>
                                <ul className="probability-list">
                                  {rf.description.characteristics.map((c, idx) => (
                                    <li key={idx}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {rf.description.recommendations && rf.description.recommendations.length > 0 && (
                              <div style={{ marginTop: '0.5rem' }}>
                                <div className="section-label">Recommendations</div>
                                <ul className="probability-list">
                                  {rf.description.recommendations.map((r, idx) => (
                                    <li key={idx}>{r}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()
              )}

              <div className="quiz-navigation" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button
                  className="btn"
                  onClick={() => onPageChange && onPageChange('dashboard')}
                >
                  View Dashboard
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers(Array(questions.length).fill(null));
                    setShowResult(false);
                    setBackendResult(null);
                    setError('');
                    try { localStorage.removeItem('quizProgress'); } catch {}
                  }}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>Thank you for completing the learning style assessment.</p>
          )}
        </div>
      </div>
    );
  }

  // Show pre-quiz form first
  if (showPreQuizForm) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <h2 style={{ marginBottom: '1rem' }}>Tell us about yourself</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Please fill in these details before starting the quiz.</p>

          <form onSubmit={handleStartQuiz} className="prequiz-form">
            <div className="prequiz-grid">
              <div className="form-field">
                <label htmlFor="name">Name (optional if logged in)</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={preQuizData.name}
                  onChange={handlePreQuizChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email (optional if logged in)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={preQuizData.email}
                  onChange={handlePreQuizChange}
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={preQuizData.age}
                  onChange={handlePreQuizChange}
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="age_group">Age Group</label>
                <select id="age_group" name="age_group" value={preQuizData.age_group} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Adult 30+">Adult 30+</option>
                  <option value="Child">Child</option>
                  <option value="Young Adult">Young Adult</option>
                  <option value="Teen">Teen</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={preQuizData.gender} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="education">Education</label>
                <select id="education" name="education" value={preQuizData.education} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Primary School">Primary School</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="preferred_study_time">Preferred Study Time</label>
                <select id="preferred_study_time" name="preferred_study_time" value={preQuizData.preferred_study_time} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="learning_goal">Learning Goal</label>
                <select id="learning_goal" name="learning_goal" value={preQuizData.learning_goal} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Exams">Exams</option>
                  <option value="Skill Development">Skill Development</option>
                  <option value="Career Growth">Career Growth</option>
                  <option value="Hobby">Hobby</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="language_preference">Language Preference</label>
                <select id="language_preference" name="language_preference" value={preQuizData.language_preference} onChange={handlePreQuizChange} required>
                  <option value="">Select</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="quiz-navigation" style={{ marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-next" type="submit">Start Quiz</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {error && (
          <div style={{ marginBottom: '1rem', color: '#b91c1c', background: '#fee2e2', padding: '0.75rem 1rem', borderRadius: 6 }}>
            {error}
          </div>
        )}
        <div className="quiz-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="quiz-question">
          <h2>{questions[currentQuestion].text}</h2>
          <p className="question-instruction">Select a value from 1 to 5.</p>
          <div className="scale-guides">
            <span className="scale-left">{questions[currentQuestion].leftLabel}</span>
            <span className="scale-right">{questions[currentQuestion].rightLabel}</span>
          </div>
          
          <div className="likert-scale">
            <div className="likert-option">
              <input 
                type="radio" 
                id={`q${currentQuestion}-1`}
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === 1}
                onChange={() => handleAnswer(1)}
              />
              <label htmlFor={`q${currentQuestion}-1`}>1</label>
            </div>
            <div className="likert-option">
              <input 
                type="radio" 
                id={`q${currentQuestion}-2`}
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === 2}
                onChange={() => handleAnswer(2)}
              />
              <label htmlFor={`q${currentQuestion}-2`}>2</label>
            </div>
            <div className="likert-option">
              <input 
                type="radio" 
                id={`q${currentQuestion}-3`}
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === 3}
                onChange={() => handleAnswer(3)}
              />
              <label htmlFor={`q${currentQuestion}-3`}>3</label>
            </div>
            <div className="likert-option">
              <input 
                type="radio" 
                id={`q${currentQuestion}-4`}
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === 4}
                onChange={() => handleAnswer(4)}
              />
              <label htmlFor={`q${currentQuestion}-4`}>4</label>
            </div>
            <div className="likert-option">
              <input 
                type="radio" 
                id={`q${currentQuestion}-5`}
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === 5}
                onChange={() => handleAnswer(5)}
              />
              <label htmlFor={`q${currentQuestion}-5`}>5</label>
            </div>
          </div>
          
          <div className="quiz-navigation">
            <button 
              className={`btn btn-previous ${currentQuestion === 0 ? 'disabled' : ''}`}
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button 
                className="btn btn-next"
                onClick={() => {
                  if (answers[currentQuestion] !== null) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else {
                    alert('Please select an answer before proceeding.');
                  }
                }}
              >
                Next
              </button>
            ) : (
              <button 
                className="btn btn-submit"
                onClick={async () => {
                  if (answers[currentQuestion] !== null) {
                    if (loading) return;
                    await calculateResult();
                  } else {
                    alert('Please select an answer before submitting.');
                  }
                }}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

