import { BuscaPagamentoUseCase } from "@/Application/use-cases/pagamentos/BuscaPagamentoUseCase";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import PagamentoRepositoryTest from "@/Infrastructure/drivers/Repositories/TestRepositories/PagamentoRepositoryTest";
import MercadoPagoServiceTest from "@/Infrastructure/drivers/Services/TestServices/MercadoPagoServiceTest";
import MercadoPagoGateway from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import PagamentoGateway from "@/Interfaces/Gateways/PagamentoGateway";
import { beforeEach, describe, expect, it } from "vitest";

let mercadoPagoGateway: MercadoPagoGateway;
let pagamentoGateway: PagamentoGateway;
let useCase: BuscaPagamentoUseCase;

describe("BuscaPagamentoUseCase", () => {
  beforeEach(() => {
    mercadoPagoGateway = new MercadoPagoGateway(new MercadoPagoServiceTest());
    pagamentoGateway = new PagamentoGateway(new PagamentoRepositoryTest());

    useCase = new BuscaPagamentoUseCase(mercadoPagoGateway, pagamentoGateway);
  });

  it("Deve retornar pagamento por idPedido", async () => {
    const pagamento = new Pagamento(
      111,
      5.5,
      222,
      StatusPagamento.recebido,
      JSON.stringify("")
    );

    pagamento.id = "333";

    await pagamentoGateway.createAsync(pagamento);
    await mercadoPagoGateway.createAsync(pagamento.valor, pagamento.idPedido);

    const { pagamento: response } = await useCase.executarAsync({
      idPedido: pagamento.idPedido,
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

  it("Deve dar erro caso não haja pagamento para o idPedido", async () => {
    await expect(useCase.executarAsync({ idPedido: 999 })).rejects.toThrowError(
      "Registro não encontrado."
    );
  });
});
