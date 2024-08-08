import { AtualizaSituacaoPagamentoUseCase } from "@/Application/use-cases/pagamentos/AtualizaSituacaoPagamentoUseCase";
import { BuscaPagamentoUseCase } from "@/Application/use-cases/pagamentos/BuscaPagamentoUseCase";
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
let useCase: AtualizaSituacaoPagamentoUseCase;

describe("BuscaPagamentoUseCase", () => {
  beforeEach(() => {
    mercadoPagoGateway = new MercadoPagoGateway(new MercadoPagoServiceTest());
    pagamentoGateway = new PagamentoGateway(new PagamentoRepositoryTest());
    pedidoQueue = new PedidoQueueTest();

    useCase = new AtualizaSituacaoPagamentoUseCase(
      mercadoPagoGateway,
      pagamentoGateway,
      pedidoQueue
    );
  });

  it("Deve permitir editar produto existente", async () => {
    const pagamento = new Pagamento(
      111,
      5.5,
      222,
      StatusPagamento.aguardando,
      JSON.stringify("")
    );

    pagamento.id = "333";

    await pagamentoGateway.createAsync(pagamento);
    await mercadoPagoGateway.createAsync(pagamento.valor, pagamento.idPedido);

    await useCase.executarAsync({
      paymentId: pagamento.paymentId,
    });

    const buscaPagamentoUseCase = new BuscaPagamentoUseCase(
      mercadoPagoGateway,
      pagamentoGateway
    );

    const { pagamento: response } = await buscaPagamentoUseCase.executarAsync({
      idPedido: pagamento.idPedido,
    });

    pagamento.paymentStatus = StatusPagamento.recebido;

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

  it("Deve retornar que não encontrou o payment ", async () => {
    const pagamento = new Pagamento(
      777,
      5.5,
      222,
      StatusPagamento.aguardando,
      JSON.stringify("")
    );

    pagamento.id = "333";

    await pagamentoGateway.createAsync(pagamento);
    await mercadoPagoGateway.createAsync(pagamento.valor, pagamento.idPedido);

    await expect(
      useCase.executarAsync({ paymentId: pagamento.paymentId })
    ).rejects.toThrowError("Registro não encontrado");
  });

  it("Deve retornar erro ao editar pagamento inexistente", async () => {
    await expect(
      useCase.executarAsync({ paymentId: 999 })
    ).rejects.toThrowError("Não foi possível consultar o pagamento");
  });
});
