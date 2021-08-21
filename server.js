import express from "express";

function serverStart(bot) {
  const app = express();

  app.use(express.json());

  app.post("/", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  const server = app.listen(process.env.PORT, "0.0.0.0", () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Web server started at http://%s:%s", host, port);
  });

  return server;
}

export { serverStart };
