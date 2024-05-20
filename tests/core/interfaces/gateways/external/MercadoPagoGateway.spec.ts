import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import MercadoPagoServiceTest from "@/Infrastructure/drivers/Services/TestServices/MercadoPagoServiceTest";
import MercadoPagoGateway from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { beforeEach, describe, expect, it } from "vitest";

describe("ClienteGateway", () => {
  let mercadoPagoService: MercadoPagoServiceTest;
  let mercadoPagoGateway: MercadoPagoGateway;

  beforeEach(() => {
    mercadoPagoService = new MercadoPagoServiceTest();
    mercadoPagoGateway = new MercadoPagoGateway(mercadoPagoService);
  });

  describe("saveAsync", () => {
    it("Deve salvar um pagamento com sucesso", async () => {
      const pagamento = new Pagamento(
        111,
        5.5,
        222,
        StatusPagamento.aguardando,
        JSON.stringify({
          api_response: { status: 200, headers: ["", [""]] },
          id: 222,
          transaction_amount: 5.5,
          description: "Pedido de lanche nro 111",
          payment_method_id: "Pix",
          external_reference: "111",
          payer: {
            email: "financeiro@lanchonete.com",
            identification: { type: "CPF", number: "28254905045" },
          },
        })
      );

      const result = await mercadoPagoGateway.createAsync(
        pagamento.valor,
        pagamento.idPedido
      );

      expect(result).toEqual(pagamento);
      expect(mercadoPagoService.payments).toContainEqual(
        JSON.parse(pagamento.responsePayload)
      );
    });

    describe("findByIdPedidoAsync", () => {
      it("Deve encontrar um pagamento por Id Pedido com sucesso", async () => {
        const pagamento = new Pagamento(
          111,
          5.5,
          222,
          StatusPagamento.aguardando,
          JSON.stringify({
            api_response: { status: 200, headers: ["", [""]] },
            id: 222,
            transaction_amount: 5.5,
            description: "Pedido de lanche nro 111",
            payment_method_id: "Pix",
            external_reference: "111",
            payer: {
              email: "financeiro@lanchonete.com",
              identification: { type: "CPF", number: "28254905045" },
            },
          })
        );

        const savedpagamento = await mercadoPagoGateway.createAsync(
          pagamento.valor,
          pagamento.idPedido
        );

        const result = await mercadoPagoGateway.findByIdAsync(
          savedpagamento.paymentId
        );

        expect(result).toEqual(JSON.parse(pagamento.responsePayload));
      });

      it("Deve retornar null se o pagamento não for encontrado", async () => {
        await expect(mercadoPagoGateway.findByIdAsync(999)).rejects.toThrow(
          "Não foi possível consultar o pagamento"
        );
      });
    });
  });
});
