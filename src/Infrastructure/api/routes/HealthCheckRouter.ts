import { Router } from "express";

const healthCheckRouter = Router();

healthCheckRouter.get("", (_, res) => {
  return res.status(201).json("Sucesso");
});

export { healthCheckRouter };
