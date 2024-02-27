const { updateVariables } = require("./googleSpreadsheet");
const state = require("./state.js");

async function logTimers() {
  const timers = await updateVariables();
  state.messageTimer = timers.messageTimer;
  state.messagePerMinute = timers.messagePerMinute;
}

module.exports = logTimers;
