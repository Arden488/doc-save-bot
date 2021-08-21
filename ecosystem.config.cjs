module.exports = {
  apps: [
    {
      name: "RunetlexBot",
      script: "./index.js",
      node_args: "-r dotenv/config",
    },
  ],
};
