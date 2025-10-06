import { Avatar, Space, Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const { Text } = Typography;

function ChatMessage({ message }) {
  const isBot = message.type === 'bot';
  
  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      <Space align="start" size="small">
        <Avatar
          icon={isBot ? <RobotOutlined /> : <UserOutlined />}
          style={{
            backgroundColor: isBot ? '#1890ff' : '#52c41a',
            flexShrink: 0,
          }}
        />
        <div className="message-content">
          <ReactMarkdown>{message.content}</ReactMarkdown>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
        </div>
      </Space>
    </div>
  );
}

export default ChatMessage;
