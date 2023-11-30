const cityTemplates = require("./cityTemplates.js");

const citiesToTemplateAndMedia = {
  cochabamba: {
    template: cityTemplates.cochabamba,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/cbba-scaled.jpeg",
    },
  },
  tarija: {
    template: cityTemplates.tarija,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/tarija-scaled.jpeg",
    },
  },
  sucre: {
    template: cityTemplates.sucre,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/sucre.jpeg",
    },
  },
  potosi: {
    template: cityTemplates.potosi,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/potosi.jpeg",
    },
  },
  oruro: {
    template: cityTemplates.oruro,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/oruro-scaled.jpeg",
    },
  },
  santacruz: {
    template: cityTemplates.santacruz,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/santacruz-scaled.jpeg",
    },
  },
  lapaz: {
    template: cityTemplates.lapaz,
    media: {
      url: "https://www.opinion.com.bo/asset/thumbnail,992,558,center,center/media/opinion/images/2014/07/16/2014N133212.jpg",
    },
  },
  elalto: {
    template: cityTemplates.elalto,
    media: {
      url: "https://www.elaltoesnoticia.com/wp-content/uploads/2016/02/bandera-de-El-Alto-300x217.jpg",
    },
  },
  uyuni: {
    template: cityTemplates.uyuni,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/uyuni.jpeg",
    },
  },
  yacuiba: {
    template: cityTemplates.yacuiba,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/yacuiba.jpeg",
    },
  },
  trinidad: {
    template: cityTemplates.trinidad,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/trinidad.jpeg",
    },
  },
  tupiza: {
    template: cityTemplates.tupiza,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/tupiza.jpeg",
    },
  },
  montero: {
    template: cityTemplates.montero,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/montero.jpeg",
    },
  },
  villazon: {
    template: cityTemplates.villazon,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/villazon.jpeg",
    },
  },
};

const cityVariations = {
  cochabamba: ["cocha", "cochabamba", "cbb", "cbba"],
  tarija: ["tarija", "trj", "tja"],
  sucre: ["sucre", "chuquisaca", "scr", "chuqui"],
  potosi: ["potosí", "potosi", "pts", "pti"],
  oruro: ["oruro", "oru"],
  santacruz: ["scz", "sc", "cruz", "santa", "stcruz", "santacruz","sta"],
  lapaz: ["lp", "lpz", "paz", "lapaz", "pax", "lapax"],
  elalto: ["alto", "ea", "delalto", "elalto"],
  uyuni: ["uyuni"],
  yacuiba: ["yacuiba"],
  trinidad: ["trinidad"],
  tupiza: ["tupiza"],
  montero: ["montero"],
  villazon: ["villazon", "villazón"],
};

module.exports = {
  citiesToTemplateAndMedia: citiesToTemplateAndMedia,
  cityVariations: cityVariations,
};
