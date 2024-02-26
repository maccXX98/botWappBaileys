const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, {
  apiKey: process.env.GOOGLE_API_KEY,
});

async function fetchData(sheetTitle, target, callback) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[sheetTitle];
    const rows = await sheet.getRows();
    return rows.map((row, index) => callback(row, index, target));
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

async function productsList(targetUrl) {
  try {
    return await fetchData("products", targetUrl, (row, index, targetUrl_1) => {
      const urls = row.get("URLs") ? row.get("URLs").split(",") : [];

      return urls.includes(targetUrl_1)
        ? {
            product: row.get("Product"),
            template: row.get("Template"),
            image: row.get("Image"),
          }
        : null;
    });
  } catch (message) {
    console.error(message);
  }
  return [];
}

async function citiesList(targetCity) {
  try {
    return await fetchData("cities", targetCity, (row, index, targetCity_1) => {
      const variations = row.get("Variations").split(",");

      return variations.includes(targetCity_1)
        ? {
            city: row.get("City"),
            template: row.get("Template"),
            image: row.get("Image"),
          }
        : null;
    });
  } catch (message) {
    console.error(message);
  }
  return [];
}

async function paymentList(targetPayment) {
  try {
    return await fetchData("payments", targetPayment, (row, index, targetPayment_1) => {
      const variations = row.get("Variations").split(",");

      return variations.includes(targetPayment_1)
        ? {
            metod: row.get("Metod"),
            template: row.get("Template"),
            image: row.get("Image"),
          }
        : null;
    });
  } catch (message) {
    console.error(message);
  }
  return [];
}

async function timersList() {
  try {
    return await fetchData("timers", null, (row) => {
      return {
        messageTimer: row.get("Message_timer"),
        messagePerMinute: row.get("Message_per_minute"),
      };
    });
  } catch (message) {
    console.error(message);
  }
  return [];
}

let messageTimer = null;
let messagePerMinute = null;

async function updateVariables() {
  try {
    const timersData = await timersList();
    if (timersData && timersData.length > 0) {
      const { messageTimer: newMessageTimer, messagePerMinute: newMessagePerMinute } = timersData[0];
      if (newMessageTimer !== messageTimer || newMessagePerMinute !== messagePerMinute) {
        messageTimer = newMessageTimer;
        messagePerMinute = newMessagePerMinute;
      }
    }
  } catch (error) {
    console.error("Error al actualizar las variables:", error);
  }
  return { messageTimer, messagePerMinute };
}

(async () => {
  await updateVariables();
  setInterval(updateVariables, 24 * 60 * 60 * 1000);
})();

module.exports = { productsList, citiesList, paymentList, updateVariables };
