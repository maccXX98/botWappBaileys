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
  disparadorHidrogel: {
    template: productTemplate.disparadorHidrogel,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/12/disparadorHidrogel.png",
    },
  },
  tanqueHidrogel: {
    template: productTemplate.tanqueHidrogel,
    media: {
      url: "https://www.novex.com.bo/wp-content/uploads/2023/12/tanqueHidrogel.png",
    },
  },
};

const urls = {
  zl02pro: [
    "https://fb.me/3baAXHaZo",
    "https://fb.me/8l0ADrOU5",
    "https://fb.me/45HGh5WWh",
    "https://fb.me/JKqq8pFo",
    "https://fb.me/3yTpLURHi",
    "https://fb.me/5QiF6iZQn",
  ],
  lenovok3: [
    "https://fb.me/6bkHK16rS",
    "https://fb.me/37dLBInAu",
    "https://fb.me/1GnmqP6Ba",
    "https://www.instagram.com/p/C0MO7KEgKB_/",
  ],
  proyector: [
    "https://fb.me/84cTsWGtH",
    "https://fb.me/whqy1OQsX",
    "https://fb.me/42tDKb8y5",
    "https://fb.me/1G7ASd7Rf",
    "https://www.instagram.com/p/Czbh2TTAmJ1/",
    "https://fb.me/44yzlB14F",
    "https://fb.me/3KhnsCLId",
  ],
  galaxyLamp: ["https://fb.me/6BR0LAjjL", "https://fb.me/5DPkpoyRK", "https://fb.me/gXUZdDj2o"],
  bell: ["https://fb.me/45ex5JHW8", "https://fb.me/4a6XKQVP2"],
  triangulePanels5: ["https://fb.me/36rvkZY0y", "https://fb.me/c6Oh4bC9p"],
  alarmClock: ["https://fb.me/8B2fl6g3Q", "https://fb.me/1GjqQ4Mk5"],
  rechargeBattery: [
    "https://fb.me/1FCffPyGI",
    "https://fb.me/3QPoszMHK",
    "https://fb.me/4Y2VKv2nR",
    "https://fb.me/fJHohfSqs",
  ],
  comboPROQT82: [
    "https://fb.me/3eQzBdeRB",
    "https://fb.me/6SYhrXCIC",
    "https://fb.me/1d7prgfv0",
    "https://fb.me/6KATvvh1T",
    "https://fb.me/1yptfYw3R",
    "https://fb.me/1uaUz17B7",
    "https://fb.me/1qs64go6a",
    "https://fb.me/72T10bUb9",
    "https://fb.me/2Y1zYkC17",
    "https://fb.me/5gWR4SQGL",
  ],
  deskLamp: ["https://fb.me/3bwVkQeto", "https://fb.me/46HqXI2x1", "https://www.instagram.com/p/C0J3uKEgfA8"],
  helicopter: [
    "https://fb.me/4LanCtEGA",
    "https://fb.me/18CUMW7mj",
    "https://fb.me/1IkFGFSvT",
    "https://fb.me/4VvrTd1jd",
    "https://fb.me/5YA5t6vUx",
    "https://fb.me/6RM3AyrOn",
    "https://fb.me/4FSjWz7XJ",
    "https://fb.me/6AYFRzQub",
    "https://fb.me/3W2CrbaqO",
    "https://fb.me/1td3dy6M6",
    "https://fb.me/1hsmCw7zz",
    "https://fb.me/3iqierP7N",
  ],
  barrasLedRgb: [
    "https://fb.me/1J5ZhmLy7",
    "https://fb.me/3gHrXphG0",
    "https://fb.me/4xH1318fk",
    "https://fb.me/3lzD5WX4F",
    "https://fb.me/9aeZPco6x",
    "https://www.instagram.com/p/Czeqhdvg3Nw/",
    "https://fb.me/12HsNROpE",
  ],
  skmmanijaroja: ["https://fb.me/79szoMg5T"],
  buggy: ["https://fb.me/38ehdWkSQ", "https://fb.me/6mdKQefkz", "https://fb.me/ev07lpOHB"],
  disparadorHidrogel: [
    "https://fb.me/1udlP4IlY",
    "https://fb.me/4HKJizri5",
    "https://fb.me/4DPqLAkuT",
    "https://fb.me/1BVXQwBuO",
    "https://www.instagram.com/p/C0Ru7j7gZ1M/",
    "https://fb.me/hfjlyIYIS",
    "https://fb.me/6HrcthFBi",
  ],
  tanqueHidrogel: [
    "https://fb.me/3ZDdg6tta",
    "https://fb.me/347pODmAk",
    "https://fb.me/1o01JB5Jv",
    "https://fb.me/35Pqk3YeS",
    "https://fb.me/19b7zZDtU",
  ],
};

module.exports = {
  urlToTemplateAndMedia: urlToTemplateAndMedia,
  urls: urls,
};
