import express from "express";
const router = express.Router();
import piadas from "../data/piadas.js";
router.get("/", (req, res) => {
  res.json(piadas);
});

router.get("/random", (req, res) => {
  const aleatoria = piadas[Math.floor(Math.random() * piadas.length)];
  res.json(aleatoria);
});

export default router;
