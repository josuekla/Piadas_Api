import express from "express";
const router = express.Router();
import piadas from "../data/piadas.js";
router.get("/", (req, res) => {
  const { categoria } = req.query;
  if (categoria) {
    const filtradas = piadas.filter((piadas) => piadas.categoria === categoria);
    return res.json(filtradas);
  }
  res.json(piadas);
});

router.get("/random", (req, res) => {
  const aleatoria = piadas[Math.floor(Math.random() * piadas.length)];
  res.json(aleatoria);
});

export default router;
