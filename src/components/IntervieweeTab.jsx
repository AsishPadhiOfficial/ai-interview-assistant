import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Input,
  Progress,
  Tag,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  SendOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  startNewSession,
  addMessage,
  updateCandidateField,
  startInterview,
  startQuestionTimer,
  updateCurrentAnswer,
  submitAnswer,
  moveToNextQuestion,
  completeInterview,
  clearCurrentCandidate,
} from '../store/interviewSlice';
import { parseResume } from '../services/resumeParser';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateFinalSummary,
} from '../services/aiService';
import { getSampleResumeData, getSampleQuestions, getSampleSummary } from '../services/sampleData';
import ChatMessage from './ChatMessage';
import QuestionCard from './QuestionCard';
import Confetti from './Confetti';
import './IntervieweeTab.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

function IntervieweeTab() {
  const dispatch = useDispatch();
  const currentCandidate = useSelector((state) => state.interview.currentCandidate);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const messagesEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCandidate?.messages]);

  // Timer logic
  useEffect(() => {
    if (
      currentCandidate?.status === 'interviewing' &&
      currentCandidate.timerStartTime &&
      currentCandidate.currentQuestionIndex >= 0 &&
      currentCandidate.currentQuestionIndex < currentCandidate.questions.length
    ) {
      const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex];
      const timeLimit = currentQuestion.timeLimit;

      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentCandidate.timerStartTime) / 1000);
        const remaining = timeLimit - elapsed;

        if (remaining <= 0) {
          clearInterval(timerIntervalRef.current);
          handleTimeUp();
        } else {
          setTimeLeft(remaining);
        }
      }, 100);

      return () => clearInterval(timerIntervalRef.current);
    }
  }, [currentCandidate?.timerStartTime, currentCandidate?.currentQuestionIndex]);

  const handleTimeUp = async () => {
    if (!currentCandidate) return;
    
    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex];
    const answer = currentCandidate.currentAnswer || '';
    
    dispatch(
      addMessage({
        type: 'user',
        content: answer || '(No answer provided - time expired)',
        timestamp: new Date().toISOString(),
      })
    );

    await handleAnswerSubmission(answer, currentQuestion.timeLimit);
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    
    try {
      const resumeData = await parseResume(file);
      
      dispatch(startNewSession({ resumeData }));
      
      // Add welcome message
      dispatch(
        addMessage({
          type: 'bot',
          content: '👋 Welcome to your AI interview! I\'ve received your resume.',
          timestamp: new Date().toISOString(),
        })
      );

      // Check if we need to collect missing info
      setTimeout(() => {
        checkMissingFields();
      }, 500);

      message.success('Resume uploaded successfully!');
    } catch (error) {
      message.error('Failed to parse resume. Please try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }

    return false; // Prevent default upload
  };

  const handleSampleData = () => {
    setIsUploading(true);
    
    try {
      const resumeData = getSampleResumeData();
      
      dispatch(startNewSession({ resumeData }));
      
      // Add welcome message
      dispatch(
        addMessage({
          type: 'bot',
          content: '👋 Welcome to your AI interview! I\'ve loaded sample data for you to test.',
          timestamp: new Date().toISOString(),
        })
      );

      // Since sample data has all fields, start interview directly
      setTimeout(() => {
        startInterviewWithSampleData();
      }, 1000);

      message.success('Sample data loaded successfully!');
    } catch (error) {
      message.error('Failed to load sample data.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const startInterviewWithSampleData = () => {
    dispatch(
      addMessage({
        type: 'bot',
        content: '✅ Great! I have all your information. Let me prepare your interview questions...',
        timestamp: new Date().toISOString(),
      })
    );

    setIsGenerating(true);

    setTimeout(() => {
      const questions = getSampleQuestions();
      dispatch(startInterview({ questions }));

      setTimeout(() => {
        dispatch(
          addMessage({
            type: 'bot',
            content: `🎯 Perfect! I've prepared 6 questions for you:
• 2 Easy questions (20 seconds each)
• 2 Medium questions (60 seconds each)
• 2 Hard questions (120 seconds each)

Ready to begin? Let's start with Question 1!`,
            timestamp: new Date().toISOString(),
          })
        );

        setTimeout(() => {
          showNextQuestion();
        }, 1000);
      }, 1000);

      setIsGenerating(false);
    }, 1500);
  };

  const checkMissingFields = () => {
    if (!currentCandidate) return;

    if (currentCandidate.missingFields.length > 0) {
      const field = currentCandidate.missingFields[0];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      
      dispatch(
        addMessage({
          type: 'bot',
          content: `I noticed your ${fieldName} is missing. Could you please provide your ${field}?`,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      startInterviewProcess();
    }
  };

  const startInterviewProcess = async () => {
    dispatch(
      addMessage({
        type: 'bot',
        content: '✅ Great! I have all your information. Let me prepare your interview questions...',
        timestamp: new Date().toISOString(),
      })
    );

    setIsGenerating(true);

    try {
      const questions = await generateInterviewQuestions(currentCandidate.resumeText);
      dispatch(startInterview({ questions }));

      setTimeout(() => {
        dispatch(
          addMessage({
            type: 'bot',
            content: `🎯 Perfect! I've prepared 6 questions for you:
• 2 Easy questions (20 seconds each)
• 2 Medium questions (60 seconds each)
• 2 Hard questions (120 seconds each)

Ready to begin? Let's start with Question 1!`,
            timestamp: new Date().toISOString(),
          })
        );

        setTimeout(() => {
          showNextQuestion();
        }, 1000);
      }, 1000);
    } catch (error) {
      message.error('Failed to generate questions. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const showNextQuestion = () => {
    if (!currentCandidate) return;

    const questionIndex = currentCandidate.currentQuestionIndex;
    if (questionIndex >= currentCandidate.questions.length) {
      finishInterview();
      return;
    }

    const question = currentCandidate.questions[questionIndex];
    
    dispatch(
      addMessage({
        type: 'bot',
        content: `**Question ${questionIndex + 1}** (${question.difficulty} - ${question.timeLimit}s)\n\n${question.question}`,
        timestamp: new Date().toISOString(),
      })
    );

    dispatch(startQuestionTimer());
    setTimeLeft(question.timeLimit);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const input = userInput.trim();
    setUserInput('');

    dispatch(
      addMessage({
        type: 'user',
        content: input,
        timestamp: new Date().toISOString(),
      })
    );

    // Handle different states
    if (currentCandidate.status === 'info_collection') {
      handleInfoCollection(input);
    } else if (currentCandidate.status === 'interviewing') {
      // Answer is being typed in real-time, submission happens via button
      dispatch(updateCurrentAnswer(input));
    }
  };

  const handleInfoCollection = (input) => {
    if (currentCandidate.missingFields.length > 0) {
      const field = currentCandidate.missingFields[0];
      dispatch(updateCandidateField({ field, value: input }));

      dispatch(
        addMessage({
          type: 'bot',
          content: `Thank you! ${field.charAt(0).toUpperCase() + field.slice(1)} recorded.`,
          timestamp: new Date().toISOString(),
        })
      );

      // Check for next missing field
      setTimeout(() => {
        checkMissingFields();
      }, 500);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    
    const answer = currentCandidate.currentAnswer || userInput.trim();
    
    if (!answer) {
      message.warning('Please type your answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    clearInterval(timerIntervalRef.current);

    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex];
    const timeTaken = currentQuestion.timeLimit - timeLeft;

    dispatch(
      addMessage({
        type: 'user',
        content: answer,
        timestamp: new Date().toISOString(),
      })
    );

    setUserInput('');

    await handleAnswerSubmission(answer, timeTaken);
    setIsSubmitting(false);
  };

  const handleAnswerSubmission = async (answer, timeTaken) => {
    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex];

    dispatch(submitAnswer({ answer, timeTaken }));

    // Show feedback
    dispatch(
      addMessage({
        type: 'bot',
        content: '✓ Answer recorded! Moving to next question...',
        timestamp: new Date().toISOString(),
      })
    );

    dispatch(moveToNextQuestion());

    // Check if interview is complete
    if (currentCandidate.currentQuestionIndex + 1 >= currentCandidate.questions.length) {
      setTimeout(() => {
        finishInterview();
      }, 1000);
    } else {
      setTimeout(() => {
        showNextQuestion();
      }, 1500);
    }
  };

  const finishInterview = async () => {
    dispatch(
      addMessage({
        type: 'bot',
        content: '🎉 Congratulations! You\'ve completed all questions. Let me evaluate your performance...',
        timestamp: new Date().toISOString(),
      })
    );

    setIsGenerating(true);

    try {
      // Check if using sample data (JOHN DOE is in the sample resume)
      const isSampleData = currentCandidate.resumeText?.includes('JOHN DOE');
      
      let summary;
      if (isSampleData) {
        // Use sample summary for demo mode (no API call needed)
        summary = getSampleSummary(currentCandidate.questions);
      } else {
        // Use real AI for actual resumes
        summary = await generateFinalSummary(
          currentCandidate.name,
          currentCandidate.questions
        );
      }

      dispatch(completeInterview(summary));

      // Trigger celebration confetti!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      setTimeout(() => {
        dispatch(
          addMessage({
            type: 'bot',
            content: `## Interview Complete! 🎊\n\n**Final Score: ${summary.score}/100**\n\n${summary.summary}\n\nThank you for participating! You can view your detailed results in the Interviewer Dashboard.`,
            timestamp: new Date().toISOString(),
          })
        );
      }, 1000);
    } catch (error) {
      message.error('Failed to generate summary.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartNewInterview = () => {
    dispatch(clearCurrentCandidate());
  };

  const renderProgress = () => {
    if (
      !currentCandidate ||
      currentCandidate.status !== 'interviewing' ||
      !currentCandidate.questions.length
    ) {
      return null;
    }

    const total = currentCandidate.questions.length;
    const current = currentCandidate.currentQuestionIndex;
    const percent = Math.round((current / total) * 100);

    return (
      <Card size="small" className="progress-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Interview Progress</Text>
          <Progress percent={percent} status="active" />
          <Text type="secondary">
            Question {current} of {total}
          </Text>
        </Space>
      </Card>
    );
  };

  const renderTimer = () => {
    if (
      !currentCandidate ||
      currentCandidate.status !== 'interviewing' ||
      !currentCandidate.timerStartTime
    ) {
      return null;
    }

    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex];
    const percent = Math.round((timeLeft / currentQuestion.timeLimit) * 100);
    const status = percent > 50 ? 'success' : percent > 20 ? 'normal' : 'exception';

    return (
      <Card size="small" className="timer-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <ClockCircleOutlined />
            <Text strong>Time Remaining</Text>
          </Space>
          <Progress
            type="circle"
            percent={percent}
            status={status}
            format={() => `${timeLeft}s`}
            width={80}
          />
        </Space>
      </Card>
    );
  };

  // No active session - show upload
  if (!currentCandidate) {
    return (
      <div className="interviewee-container">
        <Card className="upload-card">
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={3}>Start Your AI Interview</Title>
            <Text>Upload your resume (PDF or DOCX) to begin</Text>
            <Space size="middle">
              <Upload
                accept=".pdf,.doc,.docx"
                beforeUpload={handleFileUpload}
                showUploadList={false}
                disabled={isUploading}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  size="large"
                  loading={isUploading}
                >
                  Upload Resume
                </Button>
              </Upload>
              <Button
                icon={<ThunderboltOutlined />}
                size="large"
                onClick={handleSampleData}
                disabled={isUploading}
              >
                Try Sample Data
              </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Upload your resume or try sample data (no API key needed!)
            </Text>
          </Space>
        </Card>
      </div>
    );
  }

  // Active session - show chat
  return (
    <>
      <Confetti active={showConfetti} />
      <div className="interviewee-container">
      <div className="interview-sidebar">
        {renderProgress()}
        {renderTimer()}
        
        {currentCandidate.status === 'completed' && (
          <Card size="small" className="score-card">
            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
              <TrophyOutlined style={{ fontSize: '32px', color: '#faad14' }} />
              <Title level={4} style={{ margin: 0 }}>
                Final Score
              </Title>
              <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                {currentCandidate.score}/100
              </Title>
              <Button type="primary" onClick={handleStartNewInterview}>
                Start New Interview
              </Button>
            </Space>
          </Card>
        )}
      </div>

      <Card className="chat-card">
        <div className="chat-messages">
          {currentCandidate.messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isGenerating && (
            <div className="message bot-message">
              <Spin /> Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {currentCandidate.status !== 'completed' && (
          <div className="chat-input-container">
            {currentCandidate.status === 'interviewing' ? (
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    dispatch(updateCurrentAnswer(e.target.value));
                  }}
                  placeholder="Type your answer here..."
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  onPressEnter={(e) => {
                    if (e.shiftKey) return;
                    e.preventDefault();
                    handleSubmitAnswer();
                  }}
                  disabled={isSubmitting || isGenerating}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmitAnswer}
                  loading={isSubmitting}
                  disabled={isGenerating}
                  style={{ height: 'auto' }}
                >
                  Submit
                </Button>
              </Space.Compact>
            ) : (
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your response..."
                  onPressEnter={handleSendMessage}
                  disabled={isGenerating}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={isGenerating}
                >
                  Send
                </Button>
              </Space.Compact>
            )}
          </div>
        )}
      </Card>
    </div>
    </>
  );
}

export default IntervieweeTab;
