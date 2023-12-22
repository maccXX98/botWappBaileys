const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const log = require("pino");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const { productsList, citiesList, paymentList } = require("./googleSpreadsheet");
const app = express();
const city = "¿Desde qué ciudad nos escribe? 🇧🇴😁";
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let sock;
const reconnect = () => {
  connectToWhatsApp();
};
const connectToWhatsApp = async () => {
  const { state: e, saveCreds: s } = await useMultiFileAuthState("session_auth_info");
  (sock = makeWASocket({
    printQRInTerminal: !0,
    auth: e,
    logger: log({ level: "silent" }),
  })),
    sock.ev.on("connection.update", handleConnectionUpdate),
    sock.ev.on("messages.upsert", handleMessageUpsert),
    sock.ev.on("creds.update", s);
};
const deleteFolder = async (folderPath) => {
  try {
    await fs.access(folderPath);
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Carpeta session_auth_info eliminada`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`La carpeta session_auth_info no existe`);
    } else {
      throw error;
    }
  }
};
const handleDisconnection = async (message) => {
  console.log(message);
  await deleteFolder(path.join(__dirname, "session_auth_info"));
  sock?.state === "open" && sock.logout();
  connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));
};
const handleConnectionUpdate = async (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const reason = new Boom(lastDisconnect.error).output.statusCode;
    switch (reason) {
      case DisconnectReason.badSession:
        await handleDisconnection("Bad Session File, Delete session_auth_info and Scan Again");
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.restartRequired:
      case DisconnectReason.timedOut:
        reconnect();
        break;
      case DisconnectReason.connectionReplaced:
        await handleDisconnection("Connecting to another open session, close the current session");
        break;
      case DisconnectReason.loggedOut:
        await handleDisconnection("Disconnected device");
        break;
    }
  } else if (connection === "open") {
    console.log("device connected");
  }
};
let lastMessages = {};
let count = 0;
let logs = [];
let lastProductSent = {};
let processing = {};
const normalizeAndSplit = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\.,\?¡!¿]/g, "")
    .split(/\s+/);
};
const handleMessageUpsert = async ({ messages, type }) => {
  try {
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const message = messages[0];
      const sourceUrl = message?.message?.extendedTextMessage?.contextInfo?.externalAdReply?.sourceUrl || "";
      const messageBodyUrl = message?.message?.extendedTextMessage?.matchedText || "";
      const messageBodyText = message?.message?.conversation || "";
      const messageText = message?.message?.extendedTextMessage?.text || "";
      const clientNumber = message?.key?.remoteJid;

      const words = normalizeAndSplit(messageBodyText || messageText);

      const productData = await productsList(sourceUrl + messageBodyUrl + messageBodyText);
      let rowDataProduct = null;
      if (productData) {
        rowDataProduct = productData.find((data) => data !== null);
      }
      if (
        rowDataProduct &&
        lastProductSent[clientNumber] !== rowDataProduct.product &&
        !messageInProcess[clientNumber] &&
        !processing[clientNumber]
      ) {
        processing[clientNumber] = messageInProcess[clientNumber] = true;
        await sendMessage(
          clientNumber,
          { template: rowDataProduct.template, media: rowDataProduct.image },
          rowDataProduct.product
        );
        lastProductSent[clientNumber] = rowDataProduct.product;
        messageInProcess[clientNumber] = false;
        setTimeout(async () => {
          await sock.sendMessage(clientNumber, { text: city });
          lastMessages[clientNumber] = "citySent";
          processing[clientNumber] = false;
        }, 1000);
      } else if (lastMessages[clientNumber] === "citySent") {
        if (words) {
          const cityData = await Promise.all(words.map((word) => citiesList(word)));
          let rowDataCity = null;
          if (cityData) {
            rowDataCity = cityData.flat().find((data) => data !== null);
          }
          if (rowDataCity) {
            await sendMessage(
              clientNumber,
              { template: rowDataCity.template, media: rowDataCity.image },
              rowDataCity.city
            );
            lastMessages[clientNumber] = ["lapaz", "elalto"].includes(rowDataCity.city)
              ? ""
              : (lastMessages[clientNumber] = "paymentNext");
          }
        }
      } else if (lastMessages[clientNumber] === "paymentNext") {
        if (words) {
          const paymentData = await Promise.all(words.map((word) => paymentList(word)));
          let rowDataPayment = null;
          if (paymentData) {
            rowDataPayment = paymentData.flat().find((data) => data !== null);
          }
          if (rowDataPayment) {
            await sendMessage(
              clientNumber,
              { template: rowDataPayment.template, media: rowDataPayment.image },
              rowDataPayment.metod
            );
            lastMessages[clientNumber] = "";
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in handleMessageUpsert: ", error);
  }
};
fs.readFile("log.json", "utf8")
  .then((data) => ((logs = JSON.parse(data)), (count = logs.length)))
  .catch((error) =>
    error.code === "ENOENT" ? console.log("No logs found, starting new.") : console.error("Error reading logs:", error)
  );
const sendMessage = async (clientNumber, templateAndMedia, logMessage) => {
  let date = new Date();
  let options = { timeZone: "America/La_Paz", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  let formatter = new Intl.DateTimeFormat([], options);
  let timeString = formatter.format(date);
  const logData = [++count, logMessage, timeString, clientNumber.replace("@s.whatsapp.net", "")];
  logs.push(logData);
  await fs.writeFile("log.json", JSON.stringify(logs, null, 2));
  console.log(`${logData[0]} / ${logData[1]} / ${logData[2]}`);
  console.log(logData[3]);
  const image = { url: templateAndMedia.media };
  await sock.sendMessage(clientNumber, { image: image, caption: templateAndMedia.template });
};
connectToWhatsApp();
