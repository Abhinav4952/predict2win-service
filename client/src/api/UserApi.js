/* eslint-disable import/no-anonymous-default-export */
const BASE = '/api/v1/user';

export default {
  getAllLeagues() {
    return {
      url: `${BASE}/leagues`,
    };
  },

  getLeagueById(leagueId) {
    return {
      url: `${BASE}/getLeagueById/${leagueId}`,
    };
  },

  getQuestionsLeagueById(leagueId) {
    return {
      url: `${BASE}/getQuestionsByLeagueId/${leagueId}`,
    };
  },

  getAnsweredQuestionsByParticipationId(participationId) {
    return {
      url: `${BASE}/getQuestionDetails/${participationId}`,
    };
  },

  getAnswersByParticipationId(participationId) {
    return {
      url: `${BASE}/getAnswersByParticipation/${participationId}`,
    };
  },

  register({ userId, leagueId }) {
    return {
      url: `${BASE}/register/${leagueId}`,
      options: { method: 'POST' },
      payload: { userId },
    };
  },

  submitAnswers({ questionsAnswered, leagueId, participationId }) {
    return {
      url: `${BASE}/updateAnswers/${participationId}`,
      options: { method: 'POST' },
      payload: {
        questionsAnswered,
        leagueId,
      },
    };
  },
};
