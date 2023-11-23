import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { readFileSync } from "fs";
import { Boom } from "@hapi/boom";
import { createServer } from "http";
import { Server } from "socket.io";
import log from "pino";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import urlToTemplateAndMedia from "./templatesUrls.mjs";
import { city } from "./templates.mjs";
import { actions } from "./actions.mjs";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let sock;
let qrDinamic;
let count;
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: log({ level: "silent" }),
  });

  sock.ev.on("connection.update", handleConnectionUpdate);
  sock.ev.on("messages.upsert", handleMessageUpsert);
  sock.ev.on("creds.update", saveCreds);
}

function handleConnectionUpdate(update) {
  const { connection, lastDisconnect, qr } = update;
  qrDinamic = qr;
  if (connection === "close") {
    let reason = new Boom(lastDisconnect.error).output.statusCode;
    actions[reason]?.();
  } else if (connection === "open") {
    console.log("conexión abierta");
  }
}

async function handleMessageUpsert({ messages, type }) {
  try {
    if (type === "notify" && !messages[0]?.key.fromMe) {
      const sourceUrl =
        messages[0]?.message?.extendedTextMessage?.contextInfo?.externalAdReply
          ?.sourceUrl || "";
      const messageBody = messages[0].message.extendedTextMessage.text;
      const clientNumber = messages[0]?.key?.remoteJid;

      const templateAndMedia =
        urlToTemplateAndMedia[messageBody] || urlToTemplateAndMedia[sourceUrl];

      if (templateAndMedia) {
        console.log(
          `mensaje enviado ${++count} ${new Date().toLocaleTimeString()}`
        );
        console.log(clientNumber);
        const image = readFileSync(templateAndMedia.media);
        //const image = templateAndMedia.media;
        await sock.sendMessage(clientNumber, {
          image: image,
          caption: templateAndMedia.template,
        });

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
}

io.on("connection", async (socket) => {
  if (sock?.user) {
    updateQR("connected");
  } else if (qrDinamic) {
    updateQR("qr");
  }
});

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));
server.listen(port, () => {});
