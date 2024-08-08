import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import PagamentoRepositoryTest from "@/Infrastructure/drivers/Repositories/TestRepositories/PagamentoRepositoryTest";
import MercadoPagoServicesTest from "@/Infrastructure/drivers/Services/TestServices/MercadoPagoServiceTest";
import PedidoQueueTest from "@/Infrastructure/drivers/Services/TestServices/PedidoQueueTest";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import { Request, Response } from "express";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("PagamentoController", () => {
  let mockResponse: Partial<Response>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockNext: any;
  let pagamentoController: PagamentoController;
  let pagamentoRepository: PagamentoRepositoryTest;
  let mercadoPagoServices: MercadoPagoServicesTest;
  let pedidoQueue: PedidoQueueTest;

  beforeEach(() => {
    pagamentoRepository = new PagamentoRepositoryTest();
    mercadoPagoServices = new MercadoPagoServicesTest();
    pedidoQueue = new PedidoQueueTest();

    pagamentoController = new PagamentoController(
      mercadoPagoServices,
      pagamentoRepository,
      pedidoQueue
    );

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };

    mockNext = vi.fn();
  });

  describe("criar", () => {
    it("Deve criar um pagamento com sucesso", async () => {
      const id_pedido = 111;
      const valor = 5.5;

      await pagamentoController.criar(id_pedido, valor);
    });

    // it("Não deve criar um pagamento com dados inválidos", async () => {
    //   const mockRequest: Partial<Request> = {
    //     body: {
    //       valor: 5.5,
    //     },
    //   };

    //   await pagamentoController.criar(
    //     mockRequest as Request,
    //     mockResponse as Response,
    //     mockNext
    //   );

    //   expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    // });
  });

  describe("editar", () => {
    it("Deve editar um pagamento com sucesso", async () => {
      const payment: PaymentResponse = {
        api_response: { status: 200, headers: ["", [""]] },
        id: 222,
        transaction_amount: 5.5,
        description: "Pedido de lanche nro 111",
        payment_method_id: "pix",
        external_reference: "111",
        payer: {
          email: "financeiro@lanchonete.com",
          identification: {
            type: "CPF",
            number: "28254905045",
          },
        },
      };

      const pagamento = new Pagamento(
        111,
        5.5,
        222,
        StatusPagamento.aguardando,
        JSON.stringify(PaymentResponse)
      );

      mercadoPagoServices.payments.push(payment);
      pagamentoRepository.pagamentos.push(pagamento);

      const mockRequest: Partial<Request> = {
        body: {
          action: "payment.update",
          api_version: "1",
          date_created: "2025",
          id: "222",
          live_mode: true,
          type: "payment",
          user_id: 123,
        },
      };

      await pagamentoController.atualizar(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("Não deve ser processado por ser outro status", async () => {
      const payment: PaymentResponse = {
        api_response: { status: 200, headers: ["", [""]] },
        id: 222,
        transaction_amount: 5.5,
        description: "Pedido de lanche nro 111",
        payment_method_id: "pix",
        external_reference: "111",
        payer: {
          email: "financeiro@lanchonete.com",
          identification: {
            type: "CPF",
            number: "28254905045",
          },
        },
      };

      const pagamento = new Pagamento(
        111,
        5.5,
        222,
        StatusPagamento.aguardando,
        JSON.stringify(PaymentResponse)
      );

      mercadoPagoServices.payments.push(payment);
      pagamentoRepository.pagamentos.push(pagamento);

      const mockRequest: Partial<Request> = {
        body: {
          action: "payment.created",
          api_version: "1",
          date_created: "2025",
          id: "222",
          live_mode: true,
          type: "payment",
          user_id: 123,
        },
      };

      await pagamentoController.atualizar(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it("Não deve editar um pagamento com dados inválidos", async () => {
      const mockRequest: Partial<Request> = {
        params: {},
        body: {},
      };

      await pagamentoController.atualizar(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("buscarPorId", () => {
    it("Deve buscar um pagamento por ID com sucesso", async () => {
      const payment: PaymentResponse = {
        api_response: { status: 200, headers: ["", [""]] },
        id: 222,
        transaction_amount: 5.5,
        description: "Pedido de lanche nro 111",
        payment_method_id: "pix",
        external_reference: "111",
        payer: {
          email: "financeiro@lanchonete.com",
          identification: {
            type: "CPF",
            number: "28254905045",
          },
        },
      };

      const pagamento = new Pagamento(
        111,
        5.5,
        222,
        StatusPagamento.aguardando,
        JSON.stringify(PaymentResponse)
      );
      pagamento.id = "333";

      mercadoPagoServices.payments.push(payment);
      pagamentoRepository.pagamentos.push(pagamento);

      const mockRequest: Partial<Request> = {
        params: { id_pedido: "111" },
      };

      await pagamentoController.buscarPorId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.anything());
    });

    it("Deve lidar com pagamento não encontrado por IdPedido", async () => {
      const mockRequest: Partial<Request> = {
        params: { id_pedido: "999" },
      };

      await pagamentoController.buscarPorId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("Deve lidar com pagamento não encontrado por paymentId", async () => {
      const pagamento = new Pagamento(
        111,
        5.5,
        222,
        StatusPagamento.aguardando,
        JSON.stringify(PaymentResponse)
      );
      pagamento.id = "333";

      pagamentoRepository.pagamentos.push(pagamento);

      const mockRequest: Partial<Request> = {
        params: { id_pedido: "111" },
      };

      await pagamentoController.buscarPorId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
