import express from "express";
const router = express.Router();

express().set("view engine", "ejs");


router.get("/", (req, res) => {
  res.render("index.ejs", { title: "API de Piadas", message: "Bem-vindo à API de Piadas!" });
});
export default router;