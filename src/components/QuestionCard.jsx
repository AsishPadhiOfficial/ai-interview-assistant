import { Card, Tag, Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './QuestionCard.css';

const { Text, Paragraph } = Typography;

function QuestionCard({ question, index }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'Hard':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card className="question-card" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Text strong>Question {index + 1}</Text>
          <Tag color={getDifficultyColor(question.difficulty)}>{question.difficulty}</Tag>
          <Tag icon={<ClockCircleOutlined />}>{question.timeLimit}s</Tag>
        </Space>
        <Paragraph style={{ marginBottom: 0 }}>{question.question}</Paragraph>
        {question.answer && (
          <>
            <Text type="secondary">Your Answer:</Text>
            <Paragraph style={{ marginBottom: 0, fontStyle: 'italic' }}>
              {question.answer}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Time taken: {question.timeTaken}s
            </Text>
          </>
        )}
      </Space>
    </Card>
  );
}

export default QuestionCard;
