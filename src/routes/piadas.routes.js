import express from "express";
const router = express.Router();
import piadas from "../data/piadas.js";
import pagination from "../../middlewares/pagination.js";
import authenticate from "../../middlewares/auth.js";
import rateLimit from "express-rate-limit";
import apicache from "apicache";

// Configuração do cache
const cache = apicache.middleware;


const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 60, // Limite de 60 requisições por IP
  message: { message: "Muitas requisições vindas deste IP, por favor tente novamente mais tarde." }
});

// Middleware para filtrar e paginar piadas
const paginatePiadas = (req, res, next) => {
  const { categoria } = req.query;
  const data = categoria ? piadas.filter((p) => p.categoria === categoria) : piadas;
  
  // Invoca o middleware de paginação com os dados filtrados
  pagination(data)(req, res, next);
};

// Handler final que responde com os dados paginados
router.get("/", limiter, cache('2 minutes'), paginatePiadas, (req, res) => {
  const { categoria } = req.query;
  const { data, total, totalPages, currentPage, nextPage, previousPage, limit, offset } = res.locals.pagination;
  
  res.json({
    categoria: categoria || "todas",
    total,
    totalPages,
    currentPage,
    limit,
    offset,
    nextPage,
    previousPage,
    result: data
  });
});

router.get("/random", (req, res) => {
  
  try {
    console.log("Total de piadas:", piadas.length);

    const index = Math.floor(Math.random() * piadas.length);
    console.log("Índice sorteado:", index);

    const aleatoria = piadas[index];
    console.log("Piada sorteada:", aleatoria);

    res.json(aleatoria);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});



export default router;
