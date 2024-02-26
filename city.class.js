const { citiesList } = require("./googleSpreadsheet");

class City {
  constructor(template, image, city) {
    this.template = template;
    this.image = image;
    this.city = city;
  }

  static async fromWords(words) {
    const cityData = await Promise.all(words.map((word) => citiesList(word)));
    if (cityData) {
      const rowDataCity = cityData.flat().find((data) => data !== null);
      if (rowDataCity) {
        return new City(rowDataCity.template, rowDataCity.image, rowDataCity.city);
      }
    }
    return null;
  }
}

module.exports = City;
