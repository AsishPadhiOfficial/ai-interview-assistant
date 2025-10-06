// Sample data for testing without API key

export const getSampleResumeData = () => ({
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  text: `JOHN DOE
john.doe@email.com
+1 (555) 123-4567

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using React, Node.js, and modern JavaScript frameworks.

WORK EXPERIENCE

Senior Full Stack Developer | Tech Innovations Inc.
• Architected and developed 10+ React applications
• Built RESTful APIs and microservices using Node.js
• Implemented real-time features using WebSockets

TECHNICAL SKILLS
Frontend: React.js, JavaScript, TypeScript, HTML5, CSS3
Backend: Node.js, Express.js, RESTful APIs
Databases: MongoDB, PostgreSQL, MySQL`
});

export const getSampleQuestions = () => [
  {
    id: 1,
    difficulty: 'Easy',
    question: 'What is React and what are its main features?',
    timeLimit: 20,
    answer: null,
    timeTaken: null,
  },
  {
    id: 2,
    difficulty: 'Easy',
    question: 'Explain the difference between let, const, and var in JavaScript.',
    timeLimit: 20,
    answer: null,
    timeTaken: null,
  },
  {
    id: 3,
    difficulty: 'Medium',
    question: 'How does the virtual DOM work in React, and why is it beneficial?',
    timeLimit: 60,
    answer: null,
    timeTaken: null,
  },
  {
    id: 4,
    difficulty: 'Medium',
    question: 'Explain middleware in Express.js and give an example of when you would use it.',
    timeLimit: 60,
    answer: null,
    timeTaken: null,
  },
  {
    id: 5,
    difficulty: 'Hard',
    question: 'Design a REST API for a social media platform. What endpoints would you create and how would you handle authentication?',
    timeLimit: 120,
    answer: null,
    timeTaken: null,
  },
  {
    id: 6,
    difficulty: 'Hard',
    question: 'How would you optimize a React application for performance? Discuss specific techniques like code splitting, lazy loading, memoization, and when to use them.',
    timeLimit: 120,
    answer: null,
    timeTaken: null,
  },
];

export const getSampleSummary = (questions) => {
  const answeredCount = questions.filter(q => q.answer).length;
  const totalQuestions = questions.length;
  
  // Calculate basic score based on completion
  const completionScore = Math.round((answeredCount / totalQuestions) * 100);
  
  const summaries = [
    `John completed ${answeredCount} out of ${totalQuestions} questions. Demonstrated solid understanding of React fundamentals and full-stack concepts. Strong potential for the role.`,
    `Good grasp of JavaScript and React concepts. Answered questions thoughtfully with ${answeredCount}/${totalQuestions} responses provided. Shows promise for full-stack development.`,
    `Candidate showed familiarity with modern web technologies. Completed ${answeredCount}/${totalQuestions} questions. Would benefit from more hands-on experience with advanced React patterns.`
  ];
  
  return {
    score: Math.min(completionScore, 85), // Cap at 85 for sample data
    summary: summaries[Math.floor(Math.random() * summaries.length)]
  };
};
