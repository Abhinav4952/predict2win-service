/* eslint-disable import/no-anonymous-default-export */
const BASE = '/api/v1/leagueAdmin';

export default {
  addLeague(formData) {
    return {
      url: `${BASE}/addLeague`,
      options: { method: 'POST' },
      payload: formData,
    };
  },

  getLeagues() {
    return {
      url: `${BASE}/getLeagues`,
    };
  },

  getLeagueById(leagueId) {
    return {
      url: `${BASE}/getLeagueById/${leagueId}`,
    };
  },

  getQuestionByLeagueId(leagueId) {
    return {
      url: `${BASE}/getQuestionsByLeague/${leagueId}`,
    };
  },

  addQuestion({ leagueId, name, options, questionType, correctAnswerValue }) {
    return {
      url: `${BASE}/addQuestion`,
      options: { method: 'POST' },
      payload: { leagueId, name, options, questionType, correctAnswerValue },
    };
  },

  startLeague({ leagueId, slots }) {
    return {
      url: `${BASE}/startLeague`,
      options: { method: 'POST' },
      payload: { leagueId, slots },
    };
  },

  submitAnswersforLeague({ leagueId, questionAnswers }) {
    return {
      url: `${BASE}/updateAnswer`,
      options: { method: 'POST' },
      payload: { leagueId, questionAnswers },
    };
  },

  getParticipantsByLeagueId(leagueId) {
    return {
      url: `${BASE}/getParticipationsByLeagueId/${leagueId}`,
    };
  },

  getLeaderBoardByLeagueId(leagueId) {
    return {
      url: `${BASE}/getLeaderBoardByLeagueId/${leagueId}`,
    };
  },

  getLeaugeStats(leagueId) {
    return {
      url: `${BASE}/getLeagueStats/${leagueId}`,
    };
  },

  getPosts(leagueId) {
    return {
      url: `${BASE}/getPostsByLeagueId/${leagueId}`,
    };
  },

  createPost({leagueId, userId, post}){
    return {
      url: `${BASE}/createPost/${leagueId}`,
      options: { method: 'POST' },
      payload: { userId, post },
    };
  }
};
