import express from "express";

function serverStart(bot) {
  const app = express();

  app.use(express.json());

  app.post("/", (req, res) => {
    console.log(req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  return app.listen(process.env.PORT, "0.0.0.0", () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Web server started at http://%s:%s", host, port);
  });
}

export { serverStart };
