import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Space,
  Typography,
  Empty,
  Descriptions,
  Timeline,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Badge,
} from 'antd';
import {
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  UserOutlined,
  ThunderboltOutlined,
  FireOutlined,
  RocketOutlined,
  BarChartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import QuestionCard from './QuestionCard';
import ChatMessage from './ChatMessage';
import './InterviewerTab.css';

const { Title, Text, Paragraph } = Typography;

function InterviewerTab() {
  const candidates = useSelector((state) => state.interview.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Calculate analytics
  const analytics = useMemo(() => {
    const completed = candidates.filter(c => c.status === 'completed');
    const totalScore = completed.reduce((sum, c) => sum + (c.score || 0), 0);
    const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
    
    // Calculate average time per question
    let totalTime = 0;
    let totalQuestions = 0;
    completed.forEach(c => {
      if (c.questions) {
        c.questions.forEach(q => {
          if (q.timeTaken) {
            totalTime += q.timeTaken;
            totalQuestions++;
          }
        });
      }
    });
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

    // Difficulty breakdown
    const difficultyStats = { Easy: [], Medium: [], Hard: [] };
    completed.forEach(c => {
      if (c.questions) {
        c.questions.forEach(q => {
          if (q.answer && q.difficulty) {
            difficultyStats[q.difficulty].push(q.timeTaken || 0);
          }
        });
      }
    });

    const completionRate = candidates.length > 0 
      ? Math.round((completed.length / candidates.length) * 100) 
      : 0;

    return {
      totalCandidates: candidates.length,
      completedCount: completed.length,
      avgScore,
      avgTimePerQuestion,
      completionRate,
      difficultyStats,
      topPerformer: completed.sort((a, b) => (b.score || 0) - (a.score || 0))[0],
    };
  }, [candidates]);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setViewModalVisible(true);
  };

  // Calculate detailed analytics for a specific candidate
  const getCandidateAnalytics = (candidate) => {
    if (!candidate.questions || candidate.status !== 'completed') return null;

    const answered = candidate.questions.filter(q => q.answer).length;
    const total = candidate.questions.length;
    
    // Performance by difficulty
    const diffPerf = { Easy: 0, Medium: 0, Hard: 0 };
    const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
    
    candidate.questions.forEach(q => {
      if (q.answer && q.difficulty) {
        diffCount[q.difficulty]++;
        // Calculate time efficiency (answered faster = better)
        const efficiency = q.timeTaken <= q.timeLimit * 0.5 ? 100 : 
                          q.timeTaken <= q.timeLimit * 0.75 ? 80 : 60;
        diffPerf[q.difficulty] += efficiency;
      }
    });

    // Average performance per difficulty
    Object.keys(diffPerf).forEach(key => {
      diffPerf[key] = diffCount[key] > 0 ? Math.round(diffPerf[key] / diffCount[key]) : 0;
    });

    // Time management score
    const avgTimeUsed = candidate.questions.reduce((sum, q) => {
      if (q.timeTaken && q.timeLimit) {
        return sum + (q.timeTaken / q.timeLimit);
      }
      return sum;
    }, 0) / candidate.questions.length;
    
    const timeManagement = Math.round((1 - Math.abs(avgTimeUsed - 0.75)) * 100);

    // Recommendation level
    let recommendation = 'Not Recommended';
    let recColor = 'error';
    if (candidate.score >= 80) {
      recommendation = 'Highly Recommended';
      recColor = 'success';
    } else if (candidate.score >= 65) {
      recommendation = 'Recommended';
      recColor = 'success';
    } else if (candidate.score >= 50) {
      recommendation = 'Consider';
      recColor = 'warning';
    }

    return {
      answered,
      total,
      answerRate: Math.round((answered / total) * 100),
      diffPerf,
      timeManagement,
      recommendation,
      recColor,
    };
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'info_collection':
        return <Tag icon={<LoadingOutlined />} color="processing">Collecting Info</Tag>;
      case 'interviewing':
        return <Tag icon={<ClockCircleOutlined />} color="warning">In Progress</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text || 'N/A'}</Text>,
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Collecting Info', value: 'info_collection' },
        { text: 'In Progress', value: 'interviewing' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => {
        if (record.status !== 'completed') return '-';
        const color = score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error';
        return (
          <Tag color={color} icon={<TrophyOutlined />}>
            {score}/100
          </Tag>
        );
      },
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Started At',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.startedAt) - new Date(b.startedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewCandidate(record)}
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  if (candidates.length === 0) {
    return (
      <div className="interviewer-container">
        <Card>
          <Empty
            description="No candidates yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              Candidates will appear here once they start their interview
            </Text>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="interviewer-container">
      {/* Analytics Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Candidates"
              value={analytics.totalCandidates}
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={analytics.completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={analytics.completionRate} 
              showInfo={false} 
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Score"
              value={analytics.avgScore}
              suffix="/100"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: analytics.avgScore >= 70 ? '#52c41a' : analytics.avgScore >= 50 ? '#faad14' : '#ff4d4f' }}
            />
            <Progress 
              percent={analytics.avgScore} 
              showInfo={false}
              strokeColor={analytics.avgScore >= 70 ? '#52c41a' : analytics.avgScore >= 50 ? '#faad14' : '#ff4d4f'}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Time/Question"
              value={analytics.avgTimePerQuestion}
              suffix="sec"
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Performer Card */}
      {analytics.topPerformer && (
        <Card 
          style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}
        >
          <Row align="middle" gutter={16}>
            <Col>
              <StarOutlined style={{ fontSize: '32px', color: '#faad14' }} />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size={0}>
                <Text type="secondary">Top Performer</Text>
                <Title level={4} style={{ margin: 0 }}>
                  {analytics.topPerformer.name || 'Anonymous'}
                </Title>
              </Space>
            </Col>
            <Col>
              <Statistic
                value={analytics.topPerformer.score}
                suffix="/100"
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<EyeOutlined />}
                onClick={() => handleViewCandidate(analytics.topPerformer)}
              >
                View Profile
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              Candidates Overview
            </Title>
            <Tag color="blue">{candidates.length} Total</Tag>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={candidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Candidate Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCandidate && (() => {
          const candAnalytics = getCandidateAnalytics(selectedCandidate);
          
          return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Profile Information */}
            <Card size="small" title="Profile Information">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Name">
                  {selectedCandidate.name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedCandidate.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedCandidate.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {getStatusTag(selectedCandidate.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Started At">
                  {new Date(selectedCandidate.startedAt).toLocaleString()}
                </Descriptions.Item>
                {selectedCandidate.completedAt && (
                  <Descriptions.Item label="Completed At">
                    {new Date(selectedCandidate.completedAt).toLocaleString()}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* Advanced Analytics - Only for completed interviews */}
            {candAnalytics && (
              <Card 
                size="small" 
                title={
                  <Space>
                    <BarChartOutlined />
                    <span>Performance Analytics</span>
                  </Space>
                }
              >
                {/* Recommendation Badge */}
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <Badge.Ribbon 
                    text={candAnalytics.recommendation} 
                    color={candAnalytics.recColor === 'success' ? 'green' : candAnalytics.recColor === 'warning' ? 'gold' : 'red'}
                  >
                    <Card>
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text type="secondary">Hiring Recommendation</Text>
                        <Title level={3} style={{ margin: '8px 0' }}>
                          {candAnalytics.recommendation}
                        </Title>
                      </Space>
                    </Card>
                  </Badge.Ribbon>
                </div>

                {/* Performance Metrics Grid */}
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                      <Statistic
                        title="Answer Completion"
                        value={candAnalytics.answerRate}
                        suffix="%"
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: candAnalytics.answerRate === 100 ? '#52c41a' : '#faad14' }}
                      />
                      <Progress 
                        percent={candAnalytics.answerRate} 
                        size="small" 
                        style={{ marginTop: 8 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                      <Statistic
                        title="Time Management"
                        value={candAnalytics.timeManagement}
                        suffix="%"
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: candAnalytics.timeManagement >= 70 ? '#52c41a' : '#faad14' }}
                      />
                      <Progress 
                        percent={candAnalytics.timeManagement} 
                        size="small"
                        style={{ marginTop: 8 }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Difficulty Performance Breakdown */}
                <Divider orientation="left">Performance by Difficulty</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size="small" bordered={false}>
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text type="secondary">
                          <ThunderboltOutlined style={{ color: '#52c41a' }} /> Easy Questions
                        </Text>
                        <Progress 
                          percent={candAnalytics.diffPerf.Easy} 
                          strokeColor="#52c41a"
                          format={(percent) => `${percent}%`}
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" bordered={false}>
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text type="secondary">
                          <FireOutlined style={{ color: '#faad14' }} /> Medium Questions
                        </Text>
                        <Progress 
                          percent={candAnalytics.diffPerf.Medium} 
                          strokeColor="#faad14"
                          format={(percent) => `${percent}%`}
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" bordered={false}>
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text type="secondary">
                          <RocketOutlined style={{ color: '#ff4d4f' }} /> Hard Questions
                        </Text>
                        <Progress 
                          percent={candAnalytics.diffPerf.Hard} 
                          strokeColor="#ff4d4f"
                          format={(percent) => `${percent}%`}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Score and Summary */}
            {selectedCandidate.status === 'completed' && (
              <Card
                size="small"
                title={
                  <Space>
                    <TrophyOutlined />
                    Final Assessment
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>
                      {selectedCandidate.score}/100
                    </Text>
                  </div>
                  <Paragraph>{selectedCandidate.summary}</Paragraph>
                </Space>
              </Card>
            )}

            {/* Questions and Answers */}
            {selectedCandidate.questions && selectedCandidate.questions.length > 0 && (
              <Card size="small" title="Interview Questions & Answers">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {selectedCandidate.questions.map((question, index) => (
                    <QuestionCard key={question.id} question={question} index={index} />
                  ))}
                </Space>
              </Card>
            )}

            {/* Chat History */}
            {selectedCandidate.messages && selectedCandidate.messages.length > 0 && (
              <Card size="small" title="Chat History">
                <div className="chat-history">
                  {selectedCandidate.messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                  ))}
                </div>
              </Card>
            )}
          </Space>
          );
        })()}
      </Modal>
    </div>
  );
}

export default InterviewerTab;
