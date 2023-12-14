const { GoogleSpreadsheet } = require("google-spreadsheet");

let productsData = [];
let citiesData = [];
let paymentsData = [];

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
    const product = productsData.find((p) => p && p.product === targetUrl);
    if (product) {
      return product;
    } else {
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
    }
  } catch (message) {
    console.error(message);
  }
}

async function citiesList(targetCity) {
  try {
    const city = citiesData.find((c) => c && c.city === targetCity);
    if (city) {
      return city;
    } else {
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
    }
  } catch (message) {
    console.error(message);
  }
}

async function paymentList(targetPayment) {
  try {
    const payment = paymentsData.find((p) => p && p.metod === targetPayment);
    if (payment) {
      return payment;
    } else {
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
    }
  } catch (message) {
    console.error(message);
  }
}

async function loadData() {
  productsData = await fetchData("products", "", (row, index, targetUrl_1) => {
    const urls = row.get("URLs") ? row.get("URLs").split(",") : [];

    return urls.length > 0
      ? {
          product: row.get("Product"),
          template: row.get("Template"),
          image: row.get("Image"),
        }
      : null;
  });

  citiesData = await fetchData("cities", "", (row, index, targetCity_1) => {
    const variations = row.get("Variations").split(",");

    return variations.length > 0
      ? {
          city: row.get("City"),
          template: row.get("Template"),
          image: row.get("Image"),
        }
      : null;
  });

  paymentsData = await fetchData("payments", "", (row, index, targetPayment_1) => {
    const variations = row.get("Variations").split(",");
    return variations.length > 0
      ? {
          metod: row.get("Metod"),
          template: row.get("Template"),
          image: row.get("Image"),
        }
      : null;
  });
}

// Llamas a loadData cuando inicies tu chatbot
loadData();

// Actualizas los datos cada cierto tiempo (por ejemplo, cada hora)
setInterval(loadData, 60 * 60 * 1000);

module.exports = { productsList, citiesList, paymentList };
