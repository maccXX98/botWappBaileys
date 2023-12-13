module.exports = {
  apps: [
    {
      script: "server.js",
      env: {
        PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
      },
    },
    {
      script: "server.js",
      env_production: {
        PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
      },
    },
    {
      name: "botWAPP",
      script: "server.js",
    },
  ],
};
