const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();
async function fetchData(sheetTitle, target, callback) {
  try {
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, {
      apiKey: process.env.GOOGLE_API_KEY,
    });

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
module.exports = { productsList, citiesList, paymentList };
