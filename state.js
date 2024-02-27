let state = {
  sock: null,
  lastMessages: {},
  count: 0,
  logs: [],
  lastProductSent: {},
  processing: {},
  messageInProcess: {},
  messageTimer: null,
  messagePerMinute: null,
};

module.exports = state;
