import express from "express";
const router = express.Router();
import piadas from "../data/piadas.js";
import pagination from "../../middlewares/pagination.js";
import authenticate from "../../middlewares/auth.js";
import rateLimit from "express-rate-limit";



const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 60, // Limite de 60 requisições por IP
  message: { message: "Muitas requisições vindas deste IP, por favor tente novamente mais tarde." }
});

router.get("/", limiter, (req, res) => {
  const { categoria } = req.query;
  const querys = [
    categoria ? `categoria=${categoria}` : null,
    req.query.limit ? `limit=${req.query.limit}` : null,
    req.query.offset ? `offset=${req.query.offset}` : null,
  ]
  
  
  const data = categoria ? piadas.filter((p) => p.categoria === categoria) : piadas; 
  pagination(data, querys.filter(q => q !== null).join('&'))(req, res, () => {
    res.json({
      categoria: categoria || "todas",
      ...res.locals.pagination
    })
    
});
});

router.get("/random", limiter, (req, res) => {
  // console.log(limit)
  const aleatoria = piadas[Math.floor(Math.random() * piadas.length)];
  res.json(aleatoria);
});

export default router;
