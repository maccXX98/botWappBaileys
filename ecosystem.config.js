module.exports = {
  apps: [
    {
      name: "botWAPP",
      script: "server.js",
      env_production: {
        NODE_ENV: "production",
        PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
        PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
      },
    },
  ],
};
