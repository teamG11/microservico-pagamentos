import { Router } from "express";
import { ProdutoController } from "../../../Interfaces/controllers/ProdutoController";
import ProdutoRepository from "@/Infrastructure/drivers/Repositories/ProdutoRepository";

const produtoRouter = Router();

const produtoController = new ProdutoController(new ProdutoRepository());

produtoRouter.post("/", (req, res, next) => {
  void produtoController.criar(req, res, next);
});
produtoRouter.put("/:id", (req, res, next) => {
  void produtoController.editar(req, res, next);
});
produtoRouter.delete("/:id", (req, res, next) => {
  void produtoController.remover(req, res, next);
});

produtoRouter.get("", (req, res, next) => {
  void produtoController.buscarTodos(req, res, next);
});
produtoRouter.get("/:id", (req, res, next) => {
  void produtoController.buscarPorId(req, res, next);
});
produtoRouter.get("/categoria/:categoria", (req, res, next) => {
  void produtoController.buscarPorCategoria(req, res, next);
});

export { produtoRouter };
