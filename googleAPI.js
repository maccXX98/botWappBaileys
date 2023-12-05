const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function productsList(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1Lm7lAZpxNWh6NTq-B97hESBsnsRMJSj0gebFfvLdEek",
    range: "products!A2:E",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.log("No se encontraron datos.");
    return [];
  }

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
  return data;
}

async function citiesList(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1Lm7lAZpxNWh6NTq-B97hESBsnsRMJSj0gebFfvLdEek",
    range: "cities!A2:E",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.log("No se encontraron datos.");
    return [];
  }

  const data = rows.map((row) => {
    const variations = row[4] ? row[4].split(",") : [];
    return {
      id: row[0],
      city: row[1],
      template: row[2],
      image: row[3],
      variations,
    };
  });

  return data;
}

module.exports = { authorize, productsList, citiesList };

authorize()
  .then((auth) => {
    productsList(auth).catch(console.error);
    citiesList(auth).catch(console.error);
  })
  .catch(console.error);
