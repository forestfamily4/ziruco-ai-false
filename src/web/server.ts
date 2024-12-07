import express from "express";

export class Server {
  private app: express.Express;
  constructor() {
    this.app = express();
    this.app.get("/", (req, res) => {
      res.send("ok");
    });
  }
  public start() {
    const port = process.env.PORT || 4000;
    this.app.listen(port).on("listening", () => {
      console.log(`server started on http://localhost:${port}`);
    });
  }
}
