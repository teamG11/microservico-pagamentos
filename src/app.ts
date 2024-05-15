import cors from "cors";
import express from "express";

import { pagamentoRouter } from "./Infrastructure/api/routes/PagamentoRouter";
import { errorMiddleware } from "./Infrastructure/api/middlewares/error";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pagamento", pagamentoRouter);
app.use("/webhook", pagamentoRouter);

app.use(errorMiddleware);

export default app;
