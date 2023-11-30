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
  helicopter: {
    template: productTemplate.helicopter,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/helicopter.png",
    },
  },
  barrasLedRgb: {
    template: productTemplate.barrasLedRgb,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/barrasLedRgb.jpeg",
    },
  },
  skmmanijaroja: {
    template: productTemplate.skmmanijaroja,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/skmmanijaroja.jpg",
    },
  },
  buggy: {
    template: productTemplate.buggy,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/11/buggy.png",
    },
  },
};

const urls = {
  zl02pro: ["https://fb.me/3baAXHaZo", "https://fb.me/8l0ADrOU5"],
  lenovok3: ["https://fb.me/6bkHK16rS", "https://fb.me/37dLBInAu", "https://fb.me/1GnmqP6Ba"],
  proyector: ["https://fb.me/84cTsWGtH", "https://fb.me/whqy1OQsX", "https://fb.me/42tDKb8y5"],
  galaxyLamp: ["https://fb.me/6BR0LAjjL", "https://fb.me/5DPkpoyRK"], //agregado nuevo link
  bell: ["https://fb.me/45ex5JHW8"],
  triangulePanels5: ["https://fb.me/36rvkZY0y"],
  alarmClock: ["https://fb.me/8B2fl6g3Q", "https://fb.me/1GjqQ4Mk5"], //agregado nuevo link
  rechargeBattery: ["https://fb.me/1FCffPyGI", "https://fb.me/3QPoszMHK"],
  comboPROQT82: [
    "https://fb.me/3eQzBdeRB",
    "https://fb.me/6SYhrXCIC",
    "https://fb.me/1d7prgfv0",
    "https://fb.me/6KATvvh1T",
    "https://fb.me/1yptfYw3R",
    "https://fb.me/1uaUz17B7",
  ],
  deskLamp: ["https://fb.me/3bwVkQeto", "https://fb.me/46HqXI2x1", "https://www.instagram.com/p/C0J3uKEgfA8"],
  helicopter: [
    "https://fb.me/4LanCtEGA",
    "https://fb.me/18CUMW7mj",
    "https://fb.me/1IkFGFSvT",
    "https://fb.me/4VvrTd1jd",
    "https://fb.me/5YA5t6vUx",
  ],
  barrasLedRgb: ["https://fb.me/1J5ZhmLy7", "https://fb.me/3gHrXphG0", "https://fb.me/4xH1318fk"],//agregado nuevo link
  skmmanijaroja: ["https://fb.me/79szoMg5T"],
  buggy: ["https://fb.me/38ehdWkSQ"],
};

module.exports = {
  urlToTemplateAndMedia: urlToTemplateAndMedia,
  urls: urls,
};
