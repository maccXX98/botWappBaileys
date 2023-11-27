const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const { createServer } = require("http");
const log = require("pino");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const urlToTemplateAndMedia = require("./templatesUrls.js");
const { city } = require("./templates.js");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let sock;
let qrDinamic;
let count = 0;

const reconnect = () => {
  console.log("Connecting...");
  connectToWhatsApp();
};

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: log({ level: "silent" }),
  });

  sock.ev.on("connection.update", handleConnectionUpdate);
  sock.ev.on("messages.upsert", handleMessageUpsert);
  sock.ev.on("creds.update", saveCreds);
};

const handleConnectionUpdate = (update) => {
  const { connection, lastDisconnect, qr } = update;
  qrDinamic = qr;
  if (connection === "close") {
    const reason = new Boom(lastDisconnect.error).output.statusCode;
    switch (reason) {
      case DisconnectReason.badSession:
        console.log(
          "Bad Session File, Delete session_auth_info and Scan Again"
        );
        sock.logout();
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.restartRequired:
      case DisconnectReason.timedOut:
        reconnect();
        break;
      case DisconnectReason.connectionReplaced:
        console.log(
          "Connecting to another open session, close the current session"
        );
        sock.logout();
        break;
      case DisconnectReason.loggedOut:
        console.log("Disconnected device, delete session_auth_info and scan");
        sock.logout();
        break;
    }
  } else if (connection === "open") {
    console.log("device connected");
  }
};

const handleMessageUpsert = async ({ messages, type }) => {
  try {
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const sourceUrl =
        messages[0]?.message?.extendedTextMessage?.contextInfo?.externalAdReply
          ?.sourceUrl || "";
      const messageBody =
        messages?.[0]?.message?.extendedTextMessage?.text || "";
      const clientNumber = messages[0]?.key?.remoteJid;

      const findTemplateAndMedia = (map, text) => {
        for (const key of Object.keys(map)) {
          if (text.includes(key)) {
            return map[key];
          }
        }
      };

      let templateAndMedia = findTemplateAndMedia(
        urlToTemplateAndMedia,
        messageBody + sourceUrl
      );

      const sendMessage = async (templateAndMedia, logMessage) => {
        console.log(
          `${logMessage} ${++count} ${new Date().toLocaleTimeString()}`
        );
        console.log(clientNumber);
        const image = templateAndMedia.media;
        await sock.sendMessage(clientNumber, {
          image: image,
          caption: templateAndMedia.template,
        });
      };

      if (templateAndMedia) {
        await sendMessage(templateAndMedia, "product send");
        setTimeout(async () => {
          await sock.sendMessage(clientNumber, {
            text: city,
          });
        }, 2000);
      }
    }
  } catch (error) {
    console.log("error ", error);
  }
};

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));
server.listen(port, () => {});
