import cors from "cors";
import express from "express";

import { errorMiddleware } from "./Infrastructure/api/middlewares/error";
import { healthCheckRouter } from "./Infrastructure/api/routes/HealthCheckRouter";
import { pagamentoRouter } from "./Infrastructure/api/routes/PagamentoRouter";
import { webhookRouter } from "./Infrastructure/api/routes/WebhookRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health_check", healthCheckRouter);
app.use("/pagamento", pagamentoRouter);
app.use("/webhook", webhookRouter);

app.use(errorMiddleware);

export default app;
