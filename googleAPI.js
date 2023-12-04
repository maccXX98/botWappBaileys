const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
require("dotenv").config();
const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    return google.auth.fromJSON(JSON.parse(content));
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const { WEB_CLIENT_ID, WEB_CLIENT_SECRET } = process.env;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: WEB_CLIENT_ID,
    client_secret: WEB_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (!client) {
    const { WEB_CLIENT_ID, WEB_CLIENT_SECRET, WEB_REDIRECT_URIS } = process.env;
    client = new OAuth2Client(WEB_CLIENT_ID, WEB_CLIENT_SECRET, WEB_REDIRECT_URIS);
    if (client.credentials) {
      await saveCredentials(client);
    }
  }
  return client;
}

async function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "A2:E",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.log("No se encontraron datos.");
    return;
  }

  const urlToFind = "https://fb.me/hammer2"; // Reemplaza esto con tu URL

  const data = rows.map((row) => {
    const urls = row[4].split(",");
    return {
      id: row[0],
      product: row[1],
      template: row[2],
      image: row[3],
      urls,
    };
  });

  const rowData = data.find((row) => row.urls.includes(urlToFind));

  if (rowData) {
    console.log(`Se encontró la URL en la fila de ${rowData.id}`);
    console.log(`Se encontró la URL en la fila de ${rowData.product}`);
    console.log(`Se encontró la URL en la fila de ${rowData.template}`);
    console.log(`Se encontró la URL en la fila de ${rowData.image}`);
    console.log(`Se encontró la URL en la fila de ${rowData.urls}`);
  } else {
    console.log("No se encontró la URL.");
  }
}

authorize().then(listMajors).catch(console.error);
