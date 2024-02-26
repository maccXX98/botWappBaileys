const { productsList } = require("./googleSpreadsheet");

class Product {
  constructor(template, image, product) {
    this.template = template;
    this.image = image;
    this.product = product;
  }

  static async fromMessage(message) {
    const sourceUrl = message?.message?.extendedTextMessage?.contextInfo?.externalAdReply?.sourceUrl || "";
    const messageBodyUrl = message?.message?.extendedTextMessage?.matchedText || "";
    const messageBodyText = message?.message?.conversation || "";
    const productData = await productsList(sourceUrl + messageBodyUrl + messageBodyText);
    if (productData) {
      const rowDataProduct = productData.find((data) => data !== null);
      if (rowDataProduct) {
        return new Product(rowDataProduct.template, rowDataProduct.image, rowDataProduct.product);
      }
    }
    return null;
  }
}

module.exports = Product;
