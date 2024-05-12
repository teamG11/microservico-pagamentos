import { Router } from "express";
import { ClienteController } from "../../../Interfaces/controllers/ClienteController";
import ClienteRepository from "@/Infrastructure/drivers/Repositories/ClienteRepository";

const clienteRouter = Router();

const clienteController = new ClienteController(new ClienteRepository());

clienteRouter.post("", (req, res, next) => {
  void clienteController.criar(req, res, next);
});
clienteRouter.get("/:cpf", (req, res, next) => {
  void clienteController.buscar(req, res, next);
});

export { clienteRouter };
