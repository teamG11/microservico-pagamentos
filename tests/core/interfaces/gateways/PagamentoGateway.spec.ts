import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import PagamentoRepositoryTest from "@/Infrastructure/drivers/Repositories/TestRepositories/PagamentoRepositoryTest";
import PagamentoGateway from "@/Interfaces/Gateways/PagamentoGateway";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ClienteGateway", () => {
  let pagamentoRepository: PagamentoRepositoryTest;
  let pagamentoGateway: PagamentoGateway;

  beforeEach(() => {
    pagamentoRepository = new PagamentoRepositoryTest();
    pagamentoGateway = new PagamentoGateway(pagamentoRepository);
  });

  describe("saveAsync", () => {
    it("Deve salvar um pagamento com sucesso", async () => {
      const pagamento = new Pagamento(
        1234,
        5.5,
        123456,
        StatusPagamento.aguardando,
        JSON.stringify({ id: "123456" })
      );

      const result = await pagamentoGateway.createAsync(pagamento);

      pagamento.id = "333";

      expect(result).toEqual(pagamento);
      expect(pagamentoRepository.pagamentos).toContainEqual(pagamento);
    });

    it("Deve falhar ao tentar salvar um pagamento no repositório", async () => {
      const pagamento = new Pagamento(
        1234,
        5.5,
        123456,
        StatusPagamento.aguardando,
        JSON.stringify({ id: "123456" })
      );

      const saveAsyncSpy = vi
        .spyOn(pagamentoRepository, "createAsync")
        .mockRejectedValue(new Error("Erro ao salvar pagamento"));

      await expect(pagamentoGateway.createAsync(pagamento)).rejects.toThrow(
        "Erro ao salvar pagamento"
      );

      saveAsyncSpy.mockRestore();
    });
  });

  describe("updateStatusAsync", () => {
    it("Deve atualizar o status de um pagamento com sucesso", async () => {
      const pagamento = new Pagamento(
        1234,
        5.5,
        123456,
        StatusPagamento.aguardando,
        JSON.stringify({ id: "123456" })
      );

      const createdPagamento = await pagamentoGateway.createAsync(pagamento);
      createdPagamento.paymentStatus = StatusPagamento.recebido;

      const result = await pagamentoGateway.updateStatusAsync(
        createdPagamento.idPedido,
        createdPagamento.paymentStatus
      );

      expect(result).toEqual(createdPagamento);
      expect(pagamentoRepository.pagamentos).toContainEqual(createdPagamento);
    });

    it("Deve falhar ao atualizar status de um pagamento no repositório", async () => {
      const pagamento = new Pagamento(
        1234,
        5.5,
        123456,
        StatusPagamento.aguardando,
        JSON.stringify({ id: "123456" })
      );

      const updateAsyncSpy = vi
        .spyOn(pagamentoRepository, "updateStatusAsync")
        .mockRejectedValue(new Error("Erro ao atualizar pagamento"));

      await expect(
        pagamentoGateway.updateStatusAsync(
          pagamento.idPedido,
          pagamento.paymentStatus
        )
      ).rejects.toThrow("Erro ao atualizar pagamento");

      updateAsyncSpy.mockRestore();
    });

    it("Deve falhar ao nao encontrar pagamento no repositório", async () => {
      await expect(
        pagamentoGateway.updateStatusAsync(123, StatusPagamento.aguardando)
      ).rejects.toThrowError();
    });
  });

  describe("findByIdPedidoAsync", () => {
    it("Deve encontrar um pagamento por Id Pedido com sucesso", async () => {
      const pagamento = new Pagamento(
        1234,
        5.5,
        123456,
        StatusPagamento.aguardando,
        JSON.stringify({ id: "123456" })
      );

      const savedpagamento = await pagamentoGateway.createAsync(pagamento);

      const result = await pagamentoGateway.findByIdPedidoAsync(
        savedpagamento.idPedido
      );

      expect(result).toEqual(savedpagamento);
    });

    it("Deve retornar null se o pagamento não for encontrado", async () => {
      await expect(pagamentoGateway.findByIdPedidoAsync(999)).rejects.toThrow(
        "Registro não encontrado"
      );
    });
  });
});
