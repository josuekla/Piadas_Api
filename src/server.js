import express from "express";
import indexRoutes from "./routes/index.routes.js";
import piadasRoutes from "./routes/piadas.routes.js";
const app = express();

app.use(express.json());

app.use("/api/v1/piadas", piadasRoutes);
app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando 🚀 na porta ${PORT}`);
});

