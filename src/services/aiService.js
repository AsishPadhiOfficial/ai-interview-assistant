import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In production, API key should be in environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Only for demo purposes
});

export const generateInterviewQuestions = async (resumeText) => {
  try {
    const prompt = `You are an expert technical interviewer for a Full Stack Developer position (React/Node.js).

Based on the following resume, generate exactly 6 interview questions:
- 2 Easy questions (should take ~20 seconds to answer)
- 2 Medium questions (should take ~60 seconds to answer)
- 2 Hard questions (should take ~120 seconds to answer)

Resume:
${resumeText}

Return ONLY a JSON array with this exact structure:
[
  {
    "id": 1,
    "difficulty": "Easy",
    "question": "question text here",
    "timeLimit": 20
  },
  ...
]

Make questions relevant to Full Stack development with React and Node.js. Questions should test practical knowledge, problem-solving, and understanding of concepts.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Handle both direct array and object with questions array
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;
    
    return questions.map((q, index) => ({
      id: index + 1,
      difficulty: q.difficulty,
      question: q.question,
      timeLimit: q.timeLimit,
      answer: null,
      timeTaken: null,
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions if API fails
    return getFallbackQuestions();
  }
};

export const evaluateAnswer = async (question, answer, difficulty) => {
  try {
    const prompt = `Evaluate this interview answer:

Question (${difficulty}): ${question}
Answer: ${answer}

Provide a score from 0-100 and brief feedback. Return JSON format:
{
  "score": <number 0-100>,
  "feedback": "<brief feedback>"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer evaluating answers. Be fair but thorough. Return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    // Fallback scoring
    return {
      score: answer.length > 50 ? 60 : 40,
      feedback: 'Answer received. Unable to provide detailed feedback at this time.',
    };
  }
};

export const generateFinalSummary = async (candidateName, questions) => {
  try {
    const questionsAndAnswers = questions.map((q, i) => 
      `Q${i + 1} (${q.difficulty}): ${q.question}\nA: ${q.answer || 'No answer provided'}\n`
    ).join('\n');

    const prompt = `Generate a concise interview summary for ${candidateName}.

Interview Questions and Answers:
${questionsAndAnswers}

Provide:
1. Overall score (0-100)
2. Brief summary (2-3 sentences) highlighting strengths and areas for improvement

Return JSON format:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence summary>"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer providing candidate summaries. Return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating summary:', error);
    // Calculate basic score
    const totalScore = questions.reduce((sum, q) => {
      if (!q.answer) return sum;
      return sum + (q.answer.length > 50 ? 15 : 10);
    }, 0);

    return {
      score: Math.min(totalScore, 100),
      summary: `${candidateName} completed the interview. Answered ${questions.filter(q => q.answer).length} out of ${questions.length} questions.`,
    };
  }
};

// Fallback questions if API is not available
const getFallbackQuestions = () => [
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
    question: 'How would you optimize a React application for performance? Discuss specific techniques and when to use them.',
    timeLimit: 120,
    answer: null,
    timeTaken: null,
  },
];
