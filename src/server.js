const express = require("express");
const app = express();

app.use(express.json());

const piadasRoutes = require("./routes/piadas");
app.use("/piadas", piadasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API rodando 🚀");
});

