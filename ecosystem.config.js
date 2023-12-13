module.exports = {
  apps: [
    {
      script: "server.js",
      watch: ".",
      env: {
        PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
      },
    },
    {
      script: "./service-worker/",
      watch: ["./service-worker"],
      env: {
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
