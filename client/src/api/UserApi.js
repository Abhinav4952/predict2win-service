/* eslint-disable import/no-anonymous-default-export */
const BASE = '/api/v1/user';

export default {
  getAllLeagues() {
    return {
      url: `${BASE}/leagues`,
    };
  },
};
