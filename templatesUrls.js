const productTemplate = require("./productTemplates.js");

const urlToTemplateAndMedia = {
  zl02pro: {
    template: productTemplate.zl02pro,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.35-4.jpeg",
    },
  },
  comboPROQT82: {
    template: productTemplate.comboPROQT82,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.34.jpeg",
    },
  },
  rechargeBattery: {
    template: productTemplate.rechargeBattery,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.35-3.jpeg",
    },
  },
  deskLamp: {
    template: productTemplate.deskLamp,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.34-1.jpeg",
    },
  },
  lenovok3: {
    template: productTemplate.lenovok3,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.35-1.jpeg",
    },
  },
  proyector: {
    template: productTemplate.proyector,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.35-2.jpeg",
    },
  },
  galaxyLamp: {
    template: productTemplate.galaxyLamp,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-24-at-12.17.35.jpeg",
    },
  },
  bell: {
    template: productTemplate.bell,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/timbre.png",
    },
  },
  triangulePanels5: {
    template: productTemplate.triangulePanels5,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/triangulePanels5.png",
    },
  },
  alarmClock: {
    template: productTemplate.alarmClock,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/alarmClock.jpeg",
    },
  },
};

const urls = {
  zl02pro: ["https://fb.me/3baAXHaZo"],
  lenovok3: ["https://fb.me/33ei4noty"],
  proyector: ["https://fb.me/84cTsWGtH"],
  galaxyLamp: ["https://fb.me/1yy5TlBwa"],
  bell: ["https://fb.me/1EICOXuEd"],
  triangulePanels5: ["https://fb.me/36rvkZY0y"],
  alarmClock: ["https://fb.me/8B2fl6g3Q"],
  rechargeBattery: ["https://fb.me/3MH10Nway"],
  comboPROQT82: ["https://fb.me/3eQzBdeRB", "https://fb.me/6SYhrXCIC"],
  deskLamp: ["https://fb.me/3bwVkQeto", "https://fb.me/46HqXI2x1"],
};

module.exports = {
  urlToTemplateAndMedia: urlToTemplateAndMedia,
  urls: urls
};
