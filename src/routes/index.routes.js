import express from "express";
const router = express.Router();

express().set("view engine", "ejs");


router.get("/", (req, res) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.render("index.ejs", { url: url });
});
export default router;