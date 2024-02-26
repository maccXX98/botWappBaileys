const { paymentList } = require("./googleSpreadsheet");

class Payment {
  constructor(template, image, metod) {
    this.template = template;
    this.image = image;
    this.metod = metod;
  }

  static async fromWords(words) {
    const paymentData = await Promise.all(words.map((word) => paymentList(word)));
    if (paymentData) {
      const rowDataPayment = paymentData.flat().find((data) => data !== null);
      if (rowDataPayment) {
        return new Payment(rowDataPayment.template, rowDataPayment.image, rowDataPayment.metod);
      }
    }
    return null;
  }
}

module.exports = Payment;
