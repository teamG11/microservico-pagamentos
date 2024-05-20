import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import MercadoPagoService from "@/Infrastructure/drivers/Services/MercadoPagoService";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import { Router } from "express";

const webhookRouter = Router();

const pagamentoController = new PagamentoController(
  new MercadoPagoService(),
  new PagamentoRepository()
);

webhookRouter.post("", (req, res, next) => {
  void pagamentoController.atualizar(req, res, next);
});

export { webhookRouter };
