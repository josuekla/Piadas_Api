import express from "express";
import indexRoutes from "./routes/index.routes.js";
import piadasRoutes from "./routes/piadas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import authenticate from "../middlewares/auth.js";
import helmet from "helmet";
import apicache from "apicache";

const app = express();
const cache = apicache.middleware;

app.set('trust proxy', 1);
app.use(express.json());  // Mova para antes das rotas
app.use(helmet());

// Cache apenas para rotas públicas (não auth)
app.use('/api/v1/piadas', cache('2 minutes'));

const blacklist = ["1.2.3.4"];

app.use((req, res, next) => {
  if (blacklist.includes(req.ip)) {
    return res.status(403).json({ error: "IP bloqueado" });
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/", indexRoutes);
app.use("/api/v1/piadas", piadasRoutes);

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Acesso autorizado', user: req.user });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando 🚀 na porta ${PORT}`);
});

