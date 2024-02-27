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
    console.log(`Mensaje enviado. Total de mensajes enviados en el último minuto: ${messagesSentLastMinute}`);
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
      console.log(
        `Se alcanzó el límite de mensajes. Mensaje añadido a la cola. Tamaño de la cola: ${messageQueue.length}`
      );
    }
  }
};

setInterval(() => {
  while (messageQueue.length > 0 && messagesSentLastMinute < state.messagePerMinute) {
    const message = messageQueue.shift();
    sendMessage(message.clientNumber, { template: message.template, media: message.media }, message.logMessage);
    messagesSentLastMinute++;
    console.log(
      `Mensaje de la cola enviado. Total de mensajes enviados en el último minuto: ${messagesSentLastMinute}`
    );
  }
  if (messageQueue.length > 0) {
    console.log(`La cola aún tiene mensajes. Tamaño de la cola: ${messageQueue.length}`);
  }
  messagesSentLastMinute = 0;
  console.log(`Se restableció el contador de mensajes enviados.`);
}, 60000);

module.exports = sendMessage;
