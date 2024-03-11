const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Boom } = require("@hapi/boom");
const log = require("pino");
const fs = require("fs").promises;
const state = require("./state.js");
const Product = require("./product.class.js");
const City = require("./city.class.js");
const Payment = require("./payment.class.js");
const logTimers = require("./logTimers.js");
const sendMessage = require("./sendMessage.js");
const normalizeAndSplit = require("./textUtils.js");
const city = "¿Desde qué ciudad nos escribe? 🇧🇴😁";

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

const reconnect = () => {
  connectToWhatsApp();
};

const connectToWhatsApp = async () => {
  const { state: e, saveCreds: s } = await useMultiFileAuthState("session_auth_info");
  (state.sock = makeWASocket({
    printQRInTerminal: !0,
    auth: e,
    logger: log({ level: "silent" }),
  })),
    state.sock.ev.on("connection.update", handleConnectionUpdate),
    state.sock.ev.on("messages.upsert", handleMessageUpsert),
    state.sock.ev.on("creds.update", s);
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
  state.sock?.state === "open" && state.sock.logout();
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

const handleMessageUpsert = async ({ messages, type }) => {
  try {
    const message = messages[0];
    const messageBodyText = message?.message?.conversation || "";
    const messageText = message?.message?.extendedTextMessage?.text || "";
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const message = messages[0];
      const clientNumber = message?.key?.remoteJid;
      const words = normalizeAndSplit(messageBodyText || messageText);

      const product = await Product.fromMessage(message);
      if (
        product &&
        state.lastProductSent[clientNumber] !== product.product &&
        !state.messageInProcess[clientNumber] &&
        !state.processing[clientNumber]
      ) {
        state.processing[clientNumber] = state.messageInProcess[clientNumber] = true;
        setTimeout(async () => {
          await sendMessage(clientNumber, { template: product.template, media: product.image }, product.product);
          state.lastProductSent[clientNumber] = product.product;
          state.messageInProcess[clientNumber] = false;
          setTimeout(async () => {
            await state.sock.sendMessage(clientNumber, { text: city });
            state.processing[clientNumber] = false;
          }, 1000);
        }, state.messageTimer * 1000);
        state.lastMessages[clientNumber] = "citySend";
      } else if (state.lastMessages[clientNumber] === "citySend") {
        if (words) {
          const city = await City.fromWords(words);
          if (city) {
            const handleCityMessage = async () => {
              setTimeout(async () => {
                await sendMessage(clientNumber, { template: city.template, media: city.image }, city.city);
              }, state.messageTimer * 1000);
            };
            state.lastMessages[clientNumber] = ["lapaz", "elalto"].includes(city.city)
              ? ""
              : (state.lastMessages[clientNumber] = "paymentNext");
            const timer = (ms) => new Promise((res) => setTimeout(res, ms));
            await timer(state.messageTimer * 1000);
            await handleCityMessage();
          }
        }
      } else if (state.lastMessages[clientNumber] === "paymentNext") {
        if (words) {
          const payment = await Payment.fromWords(words);
          if (payment) {
            setTimeout(async () => {
              await sendMessage(clientNumber, { template: payment.template, media: payment.image }, payment.metod);
              state.lastMessages[clientNumber] = "";
            }, state.messageTimer * 1000);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in MessageSending: ", error);
  }
};

fs.readFile("log.json", "utf8")
  .then((data) => ((state.logs = JSON.parse(data)), (state.count = state.logs.length)))
  .catch((error) =>
    error.code === "ENOENT" ? console.log("No Logs found, starting new.") : console.error("Error reading Logs:", error)
  );

logTimers();
connectToWhatsApp();
app.listen(process.env.PORT || 8080, () => {});
