const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const { createServer } = require("http");
const log = require("pino");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { authorize, productsList, citiesList } = require("./googleAPI.js");

const city = "¿Desde qué ciudad nos escribe? 🇧🇴😁";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

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
  fs.existsSync(folderPath)
    ? (fs.rmSync(folderPath, { recursive: true, force: true }), console.log(`Carpeta session_auth_info eliminada`))
    : console.log(`La carpeta session_auth_info no existe`);
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

const handleMessageUpsert = async ({ messages, type }) => {
  try {
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const message = messages[0];
      const sourceUrl = message?.message?.extendedTextMessage?.contextInfo?.externalAdReply?.sourceUrl || "";
      const messageBodyUrl = message?.message?.extendedTextMessage?.matchedText || "";
      const messageBodyText = message?.message?.conversation || "";
      const messageText = message?.message?.extendedTextMessage?.text || "";
      const clientNumber = message?.key?.remoteJid;

      const auth = await authorize();
      const data = await productsList(auth);
      const rowDataProduct = data.find((row) => row.urls.includes(sourceUrl + messageBodyUrl + messageBodyText));

      if (rowDataProduct) {
        let product = rowDataProduct.product;
        let templateAndMedia = { template: rowDataProduct.template, media: rowDataProduct.image };

        if (templateAndMedia) {
          await sendMessage(clientNumber, templateAndMedia, product);
          setTimeout(async () => {
            await sock.sendMessage(clientNumber, { text: city });
            lastMessages[clientNumber] = "next";
          }, 2000);
        }
      } else if (lastMessages[clientNumber] === "next") {
        let words;
        if (messageBodyText) {
          const symbolFreeMessageBody = messageBodyText.toLowerCase().replace(/[\.,\?¡!¿]/g, "");
          words = symbolFreeMessageBody.split(/\s+/);
        } else if (messageText) {
          const symbolFreeMessageText = messageText.toLowerCase().replace(/[\.,\?¡!¿]/g, "");
          words = symbolFreeMessageText.split(/\s+/);
        }
        const auth = await authorize();
        const cityData = await citiesList(auth);
        const rowDataCity = cityData.find((row) => row.variations.some((variation) => words.includes(variation)));
        if (rowDataCity) {
          let cityName = rowDataCity.city;
          let templateAndMedia = { template: rowDataCity.template, media: rowDataCity.image };

          if (templateAndMedia) {
            await sendMessage(clientNumber, templateAndMedia, cityName);
          }
          lastMessages[clientNumber] = "";
        }
      }
    }
  } catch (error) {
    console.error("Error in handleMessageUpsert: ", error);
  }
};

const sendMessage = async (clientNumber, templateAndMedia, logMessage) => {
  const logData = [
    ++count,
    logMessage,
    new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 - 4 * 60 * 60000).toLocaleTimeString(),
    clientNumber.replace("@s.whatsapp.net", ""),
  ];

  console.log(`${logData[0]} / ${logData[1]} / ${logData[2]}`);
  console.log(logData[3]);

  fs.readFile("log.json", (err, data) => {
    if (err) throw err;
    let json = [];
    if (data.length !== 0) {
      json = JSON.parse(data);
    }
    json.push(logData);

    fs.writeFile("log.json", JSON.stringify(json), (err) => {
      if (err) throw err;
    });
  });

  const image = { url: templateAndMedia.media };
  await sock.sendMessage(clientNumber, {
    image: image,
    caption: templateAndMedia.template,
  });
};

connectToWhatsApp();
server.listen(port, () => {});
