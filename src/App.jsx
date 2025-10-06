import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Modal, Button, Space, Typography, Switch } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ReloadOutlined, 
  RocketOutlined,
  BulbOutlined
} from '@ant-design/icons';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import { loadCandidate, resetAllData } from './store/interviewSlice';
import './App.css';

const { Title, Text } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const currentCandidate = useSelector((state) => state.interview.currentCandidate);

  useEffect(() => {
    // Check if there's an incomplete session after Redux rehydration
    if (currentCandidate && currentCandidate.status !== 'completed') {
      setShowWelcomeBack(true);
    }
  }, [currentCandidate]);

  const handleContinueSession = () => {
    setShowWelcomeBack(false);
    setActiveTab('interviewee');
  };

  const handleStartNewSession = () => {
    setShowWelcomeBack(false);
    // Current candidate will be shown in interviewee tab
  };

  const handleResetAll = () => {
    Modal.confirm({
      title: 'Reset All Data',
      content: 'Are you sure you want to delete all interview data? This cannot be undone.',
      okText: 'Yes, Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(resetAllData());
        setActiveTab('interviewee');
      },
    });
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined /> Interviewee
        </span>
      ),
      children: <IntervieweeTab />,
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <TeamOutlined /> Interviewer Dashboard
        </span>
      ),
      children: <InterviewerTab />,
    },
  ];

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="app-header">
        <div className="header-content">
          <Space size="middle">
            <RocketOutlined style={{ fontSize: '32px', color: '#fff' }} />
            <Title level={2} style={{ margin: 0, color: '#fff' }}>
              AI Interview Assistant - Crisp
            </Title>
          </Space>
          <Space>
            <Space align="center">
              <BulbOutlined style={{ color: '#fff', fontSize: '18px' }} />
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetAll}
              danger
              type="text"
              style={{ color: '#fff' }}
            >
              Reset All
            </Button>
          </Space>
        </div>
      </div>

      <div className="app-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          className="main-tabs"
        />
      </div>

      <Modal
        title="Welcome Back! 👋"
        open={showWelcomeBack}
        onCancel={() => setShowWelcomeBack(false)}
        footer={[
          <Button key="new" onClick={handleStartNewSession}>
            Start New Interview
          </Button>,
          <Button key="continue" type="primary" onClick={handleContinueSession}>
            Continue Previous Session
          </Button>,
        ]}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Text>
            You have an incomplete interview session. Would you like to continue where you left
            off?
          </Text>
          {currentCandidate && (
            <div>
              <Text strong>Session Details:</Text>
              <br />
              <Text>Name: {currentCandidate.name || 'Not provided'}</Text>
              <br />
              <Text>Status: {currentCandidate.status}</Text>
              <br />
              {currentCandidate.status === 'interviewing' && (
                <Text>
                  Progress: Question {currentCandidate.currentQuestionIndex + 1} of{' '}
                  {currentCandidate.questions?.length || 6}
                </Text>
              )}
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
}

export default App;
