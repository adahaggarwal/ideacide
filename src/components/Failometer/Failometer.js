import React, { useState, useEffect } from 'react';
import failometerAPI from '../../services/failometerAPI';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import RiskAssessment from './RiskAssessment';
import './Failometer.css';

const Failometer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [totalSteps, setTotalSteps] = useState(10); // Estimated total steps

  // Initialize with base questions
  useEffect(() => {
    const baseQuestions = failometerAPI.getBaseQuestions();
    setQuestions(baseQuestions);
  }, []);

  // Handle answer submission
  const handleAnswerSubmit = async (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Add to history
    const currentQuestion = questions.find(q => q.id === questionId);
    setQuestionHistory(prev => [...prev, { question: currentQuestion, answer }]);

    // Check if we should generate follow-up questions
    if (currentStep < 3 || (currentStep > 0 && currentStep % 3 === 0)) {
      await generateFollowUpQuestions(newAnswers);
    }

    // Move to next step
    setCurrentStep(prev => prev + 1);
  };

  // Generate AI-powered follow-up questions
  const generateFollowUpQuestions = async (currentAnswers) => {
    setLoading(true);
    try {
      const followUpQuestions = await failometerAPI.generateFollowUpQuestions(
        currentAnswers, 
        questionHistory
      );
      
      if (followUpQuestions.length > 0) {
        setQuestions(prev => [...prev, ...followUpQuestions]);
        setTotalSteps(prev => prev + followUpQuestions.length);
      }
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate final risk assessment
  const generateRiskAssessment = async () => {
    setAssessmentLoading(true);
    try {
      const assessment = await failometerAPI.generateRiskAssessment(answers);
      setRiskAssessment(assessment);
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      // Use fallback assessment
      const fallbackAssessment = failometerAPI.getFallbackRiskAssessment(answers);
      setRiskAssessment(fallbackAssessment);
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Check if assessment should be triggered
  useEffect(() => {
    if (currentStep >= 8 && !riskAssessment && !assessmentLoading) {
      generateRiskAssessment();
    }
  }, [currentStep, riskAssessment, assessmentLoading]);

  // Handle restart
  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRiskAssessment(null);
    setQuestionHistory([]);
    setQuestions(failometerAPI.getBaseQuestions());
    setTotalSteps(10);
  };

  // Get current question
  const getCurrentQuestion = () => {
    return questions[currentStep];
  };

  const progress = Math.min((currentStep / totalSteps) * 100, 100);
  const isComplete = currentStep >= questions.length || riskAssessment;

  return (
    <div className="failometer">
      <div className="failometer-container">
        {/* Header */}
        <div className="failometer-header">
          <h1 className="failometer-title">
            <span className="failometer-icon">🎯</span>
            Failometer
          </h1>
          <p className="failometer-subtitle">
            Validate your startup idea with AI-powered risk assessment
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} currentStep={currentStep} totalSteps={totalSteps} />

        {/* Content */}
        <div className="failometer-content">
          {loading && (
            <div className="failometer-loading">
              <div className="spinner"></div>
              <p>Analyzing your answers and generating follow-up questions...</p>
            </div>
          )}

          {assessmentLoading && (
            <div className="failometer-loading">
              <div className="spinner"></div>
              <p>Generating your comprehensive risk assessment...</p>
            </div>
          )}

          {!isComplete && !loading && !assessmentLoading && (
            <QuestionCard
              question={getCurrentQuestion()}
              onAnswerSubmit={handleAnswerSubmit}
              questionNumber={currentStep + 1}
              totalQuestions={Math.max(totalSteps, questions.length)}
            />
          )}

          {riskAssessment && (
            <RiskAssessment
              assessment={riskAssessment}
              answers={answers}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* Footer */}
        <div className="failometer-footer">
          <p className="disclaimer">
            This assessment is for educational purposes. Always consult with business advisors 
            for professional guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Failometer;
