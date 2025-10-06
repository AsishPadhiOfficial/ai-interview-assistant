import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  currentCandidate: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startNewSession: (state, action) => {
      const { resumeData } = action.payload;
      const newCandidate = {
        id: Date.now().toString(),
        name: resumeData.name || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        resumeText: resumeData.text || '',
        status: 'info_collection', // info_collection, interviewing, completed
        messages: [],
        questions: [],
        currentQuestionIndex: -1,
        score: 0,
        summary: '',
        startedAt: new Date().toISOString(),
        completedAt: null,
        missingFields: [],
        timerStartTime: null,
        currentAnswer: '',
      };

      // Determine missing fields
      if (!newCandidate.name) newCandidate.missingFields.push('name');
      if (!newCandidate.email) newCandidate.missingFields.push('email');
      if (!newCandidate.phone) newCandidate.missingFields.push('phone');

      state.currentCandidate = newCandidate;
      state.candidates.push(newCandidate);
    },

    addMessage: (state, action) => {
      if (state.currentCandidate) {
        state.currentCandidate.messages.push(action.payload);
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].messages = state.currentCandidate.messages;
        }
      }
    },

    updateCandidateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentCandidate) {
        state.currentCandidate[field] = value;
        // Remove from missing fields
        state.currentCandidate.missingFields = state.currentCandidate.missingFields.filter(
          f => f !== field
        );
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index][field] = value;
          state.candidates[index].missingFields = state.currentCandidate.missingFields;
        }
      }
    },

    startInterview: (state, action) => {
      if (state.currentCandidate) {
        state.currentCandidate.status = 'interviewing';
        state.currentCandidate.questions = action.payload.questions;
        state.currentCandidate.currentQuestionIndex = 0;
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].status = 'interviewing';
          state.candidates[index].questions = action.payload.questions;
          state.candidates[index].currentQuestionIndex = 0;
        }
      }
    },

    startQuestionTimer: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.timerStartTime = Date.now();
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].timerStartTime = Date.now();
        }
      }
    },

    updateCurrentAnswer: (state, action) => {
      if (state.currentCandidate) {
        state.currentCandidate.currentAnswer = action.payload;
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].currentAnswer = action.payload;
        }
      }
    },

    submitAnswer: (state, action) => {
      const { answer, timeTaken } = action.payload;
      if (state.currentCandidate && state.currentCandidate.currentQuestionIndex >= 0) {
        const questionIndex = state.currentCandidate.currentQuestionIndex;
        state.currentCandidate.questions[questionIndex].answer = answer;
        state.currentCandidate.questions[questionIndex].timeTaken = timeTaken;
        state.currentCandidate.currentAnswer = '';
        state.currentCandidate.timerStartTime = null;

        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].questions[questionIndex].answer = answer;
          state.candidates[index].questions[questionIndex].timeTaken = timeTaken;
          state.candidates[index].currentAnswer = '';
          state.candidates[index].timerStartTime = null;
        }
      }
    },

    moveToNextQuestion: (state) => {
      if (state.currentCandidate) {
        state.currentCandidate.currentQuestionIndex += 1;
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].currentQuestionIndex = state.currentCandidate.currentQuestionIndex;
        }
      }
    },

    completeInterview: (state, action) => {
      const { score, summary } = action.payload;
      if (state.currentCandidate) {
        state.currentCandidate.status = 'completed';
        state.currentCandidate.score = score;
        state.currentCandidate.summary = summary;
        state.currentCandidate.completedAt = new Date().toISOString();
        
        // Update in candidates array
        const index = state.candidates.findIndex(c => c.id === state.currentCandidate.id);
        if (index !== -1) {
          state.candidates[index].status = 'completed';
          state.candidates[index].score = score;
          state.candidates[index].summary = summary;
          state.candidates[index].completedAt = state.currentCandidate.completedAt;
        }
      }
    },

    clearCurrentCandidate: (state) => {
      state.currentCandidate = null;
    },

    loadCandidate: (state, action) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (candidate) {
        state.currentCandidate = { ...candidate };
      }
    },

    resetAllData: (state) => {
      state.candidates = [];
      state.currentCandidate = null;
    },
  },
});

export const {
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
  loadCandidate,
  resetAllData,
} = interviewSlice.actions;

export default interviewSlice.reducer;
