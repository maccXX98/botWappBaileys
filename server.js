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
const fs = require("fs");
const path = require("path");
const urlToTemplateAndMedia =
  require("./templatesUrls.js").urlToTemplateAndMedia;
const urls = require("./templatesUrls.js").urls;
const { city } = require("./productTemplates.js");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const reconnect = () => {
  connectToWhatsApp();
};

let sock;
const connectToWhatsApp = async () => {
  const { state: e, saveCreds: s } = await useMultiFileAuthState(
    "session_auth_info"
  );
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
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Carpeta session_auth_info eliminada`);
  } else {
    console.log(`La carpeta session_auth_info no existe`);
  }
};

const handleDisconnection = async (message) => {
  console.log(message);
  await deleteFolder(path.join(__dirname, "session_auth_info"));
  if (sock && sock.state === "open") {
    sock.logout();
  }
  connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));
};

const handleConnectionUpdate = async (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const reason = new Boom(lastDisconnect.error).output.statusCode;
    switch (reason) {
      case DisconnectReason.badSession:
        await handleDisconnection(
          "Bad Session File, Delete session_auth_info and Scan Again"
        );
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.restartRequired:
      case DisconnectReason.timedOut:
        reconnect();
        break;
      case DisconnectReason.connectionReplaced:
        await handleDisconnection(
          "Connecting to another open session, close the current session"
        );
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
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const sourceUrl =
        messages[0]?.message?.extendedTextMessage?.contextInfo?.externalAdReply
          ?.sourceUrl || "";
      const messageBody =
        messages?.[0]?.message?.extendedTextMessage?.text || "";
      const clientNumber = messages[0]?.key?.remoteJid;

      const findProduct = (map, text) => {
        for (const [product, urls] of Object.entries(map)) {
          for (const url of urls) {
            if (text.includes(url)) {
              return product;
            }
          }
        }
      };

      let product = findProduct(urls, sourceUrl + messageBody);
      let templateAndMedia = urlToTemplateAndMedia[product];

      if (templateAndMedia) {
        await sendMessage(clientNumber, templateAndMedia, "product send");
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

let count = 0;
const sendMessage = async (clientNumber, templateAndMedia, logMessage) => {
  console.log(
    `${logMessage} ${++count} ${new Date(
      new Date().getTime() +
        new Date().getTimezoneOffset() * 60000 -
        4 * 60 * 60000
    ).toLocaleTimeString()}`
  );
  console.log(clientNumber.replace("@s.whatsapp.net", ""));
  const image = templateAndMedia.media;
  await sock.sendMessage(clientNumber, {
    image: image,
    caption: templateAndMedia.template,
  });
};

connectToWhatsApp();
server.listen(port, () => {});
