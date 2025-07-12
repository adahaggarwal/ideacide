import React, { useState } from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, onAnswerSubmit, questionNumber, totalQuestions }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  if (!question) return null;

  const handleSubmit = () => {
    const finalAnswer = question.type === 'multiple_choice' ? selectedOption : answer;
    
    if (!finalAnswer || (question.required && !finalAnswer.trim())) {
      alert('Please provide an answer before continuing.');
      return;
    }

    onAnswerSubmit(question.id, finalAnswer);
    setAnswer('');
    setSelectedOption('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && question.type === 'text') {
      handleSubmit();
    }
  };

  const isAnswered = question.type === 'multiple_choice' ? selectedOption : answer.trim();

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
        <span className="question-category">{question.category?.replace('_', ' ')}</span>
      </div>

      <div className="question-content">
        <h2 className="question-title">{question.question}</h2>
        
        {question.followUpLogic && (
          <div className="follow-up-context">
            <p className="context-text">
              <span className="context-icon">💡</span>
              {question.followUpLogic}
            </p>
          </div>
        )}

        <div className="question-input">
          {question.type === 'text' && (
            <div className="text-input-container">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={question.placeholder || 'Enter your answer...'}
                className="text-input"
                rows="4"
                maxLength="500"
              />
              <div className="character-count">
                {answer.length}/500
              </div>
            </div>
          )}

          {question.type === 'multiple_choice' && (
            <div className="multiple-choice-container">
              {question.options?.map((option, index) => (
                <div
                  key={option.value}
                  className={`choice-option ${selectedOption === option.value ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(option.value)}
                >
                  <div className="choice-radio">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={() => setSelectedOption(option.value)}
                    />
                    <span className="radio-custom"></span>
                  </div>
                  <div className="choice-content">
                    <span className="choice-text">{option.text}</span>
                    {option.risk !== undefined && (
                      <div className="risk-indicator">
                        <span className="risk-level">
                          Risk: {getRiskLevel(option.risk)}
                        </span>
                        <div className="risk-bar">
                          <div 
                            className="risk-fill" 
                            style={{ 
                              width: `${option.risk * 100}%`,
                              backgroundColor: getRiskColor(option.risk)
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {question.type === 'scale' && (
            <div className="scale-input-container">
              <div className="scale-labels">
                <span>Strongly Disagree</span>
                <span>Neutral</span>
                <span>Strongly Agree</span>
              </div>
              <div className="scale-options">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`scale-option ${selectedOption === value.toString() ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(value.toString())}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="question-footer">
        <button 
          className={`submit-btn ${isAnswered ? 'active' : ''}`}
          onClick={handleSubmit}
          disabled={!isAnswered}
        >
          {questionNumber === totalQuestions ? 'Complete Assessment' : 'Next Question'}
          <span className="btn-icon">→</span>
        </button>
      </div>
    </div>
  );
};

// Helper functions
const getRiskLevel = (risk) => {
  if (risk <= 0.3) return 'Low';
  if (risk <= 0.6) return 'Medium';
  return 'High';
};

const getRiskColor = (risk) => {
  if (risk <= 0.3) return '#10b981'; // Green
  if (risk <= 0.6) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

export default QuestionCard;
