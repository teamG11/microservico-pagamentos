import { CriaPagamentoUseCase } from "@/Application/use-cases/pagamentos/CriaPagamentoUseCase";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import PagamentoRepositoryTest from "@/Infrastructure/drivers/Repositories/TestRepositories/PagamentoRepositoryTest";
import MercadoPagoServiceTest from "@/Infrastructure/drivers/Services/TestServices/MercadoPagoServiceTest";
import PedidoQueueTest from "@/Infrastructure/drivers/Services/TestServices/PedidoQueueTest";
import MercadoPagoGateway from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import PagamentoGateway from "@/Interfaces/Gateways/PagamentoGateway";
import { beforeEach, describe, expect, it } from "vitest";

let mercadoPagoGateway: MercadoPagoGateway;
let pagamentoGateway: PagamentoGateway;
let pedidoQueue: PedidoQueueTest;
let useCase: CriaPagamentoUseCase;

describe("CriaPagamentoUseCase", () => {
  beforeEach(() => {
    mercadoPagoGateway = new MercadoPagoGateway(new MercadoPagoServiceTest());
    pagamentoGateway = new PagamentoGateway(new PagamentoRepositoryTest());
    pedidoQueue = new PedidoQueueTest();

    useCase = new CriaPagamentoUseCase(
      mercadoPagoGateway,
      pagamentoGateway,
      pedidoQueue
    );
  });

  it("Deve permitir cadastrar pagamento", async () => {
    const pagamento = new Pagamento(
      111,
      5.5,
      222,
      StatusPagamento.aguardando,
      JSON.stringify({
        api_response: { status: 200, headers: ["", [""]] },
        id: 222,
        status: StatusPagamento.aguardando,
        transaction_amount: 5.5,
        description: "Pedido de lanche nro 111",
        payment_method_id: "pix",
        external_reference: "111",
        payer: {
          email: "financeiro@lanchonete.com",
          identification: { type: "CPF", number: "28254905045" },
        },
      })
    );

    pagamento.id = "333";

    const { pagamento: response } = await useCase.executarAsync({
      idPedido: pagamento.idPedido,
      valor: pagamento.valor,
    });

    expect(response.id).toBe(pagamento.id);
    expect(response.idPedido).toBe(pagamento.idPedido);
    expect(response.paymentId).toBe(pagamento.paymentId);
    expect(response.paymentStatus).toBe(pagamento.paymentStatus);
    expect(response.valor).toBe(pagamento.valor);
    expect(response.responsePayload).toBe(pagamento.responsePayload);
    expect(response.webhookResponsePayload).toBe(
      pagamento.webhookResponsePayload
    );
  });
});
