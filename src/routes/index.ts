import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.end("Hello World!");
});

export default Object.assign(router, { _path: "/" });
