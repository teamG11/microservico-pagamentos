import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import { PagamentoController } from "@/Interfaces/controllers/PagamentoController";
import { Router } from "express";

const pagamentoRouter = Router();

const pagamentoController = new PagamentoController(new PagamentoRepository());

pagamentoRouter.post("", (req, res, next) => {
  void pagamentoController.criar(req, res, next);
});

export { pagamentoRouter };
