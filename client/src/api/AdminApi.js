/* eslint-disable import/no-anonymous-default-export */
const BASE = '/api/v1/admin';

export default {
  addLeagueAdmin({ firstName, lastName, email, username }) {
    return {
      url: `${BASE}/addLeagueAdmin`,
      options: { method: 'POST' },
      payload: { firstName, lastName, email, username },
    };
  },
};
