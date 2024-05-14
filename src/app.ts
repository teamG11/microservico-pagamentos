import cors from "cors";
import express from "express";

import { pagamentoRouter } from "./Infrastructure/api/routes/PagamentoRouter";
import { produtoRouter } from "./Infrastructure/api/routes/ProdutoRouter";

import { errorMiddleware } from "./Infrastructure/api/middlewares/error";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pagamento", pagamentoRouter);
app.use("/webhook", produtoRouter);

app.use(errorMiddleware);

export default app;
