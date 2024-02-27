const fs = require("fs").promises;
const state = require("./state.js");

let messagesSentLastMinute = 0;
const messageQueue = [];

const sendMessage = async (clientNumber, templateAndMedia, logMessage) => {
  let date = new Date();
  let options = { timeZone: "America/La_Paz", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  let formatter = new Intl.DateTimeFormat([], options);
  let timeString = formatter.format(date);
  const logData = [++state.count, logMessage, timeString, clientNumber.replace("@s.whatsapp.net", "")];
  state.logs.push(logData);
  await fs.writeFile("log.json", JSON.stringify(state.logs, null, 2));
  console.log(`${logData[0]} / ${logData[1]} / ${logData[2]}`);
  console.log(logData[3]);

  if (messagesSentLastMinute < state.messagePerMinute) {
    const image = { url: templateAndMedia.media };
    await state.sock.sendMessage(clientNumber, { image: image, caption: templateAndMedia.template });
    messagesSentLastMinute++;
  } else {
    const messageInQueue = messageQueue.find(
      (message) => message.clientNumber === clientNumber && message.logMessage === logMessage
    );
    if (!messageInQueue) {
      messageQueue.push({
        clientNumber,
        template: templateAndMedia.template,
        media: templateAndMedia.media,
        logMessage,
      });
    }
  }
};

setInterval(() => {
  while (messageQueue.length > 0 && messagesSentLastMinute < state.messagePerMinute) {
    const message = messageQueue.shift();
    sendMessage(message.clientNumber, { template: message.template, media: message.media }, message.logMessage);
    messagesSentLastMinute++;
  }
  if (messageQueue.length > 0) {
  }
  messagesSentLastMinute = 0;
}, 60000);

module.exports = sendMessage;
