const express = require("express");
const router = express.Router();
const piadas = require("../data/piadas");

router.get("/", (req, res) => {
  res.json(piadas);
});

router.get("/random", (req, res) => {
  const aleatoria = piadas[Math.floor(Math.random() * piadas.length)];
  res.json(aleatoria);
});

module.exports = router;
