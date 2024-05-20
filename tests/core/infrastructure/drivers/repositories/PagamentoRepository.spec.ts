import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import { prisma } from "@/Infrastructure/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/Infrastructure/lib/prisma", () => ({
  prisma: {
    pagamento: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("PagamentoRepository", () => {
  let repository: PagamentoRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PagamentoRepository();
  });

  it("deve encontrar um pagamento por IdPedido corretamente", async () => {
    const pagamento = {
      id: "123465-abv",
      idPedido: 1234,
      valor: 5.5,
      paymentId: 123456,
      paymentStatus: StatusPagamento.aguardando,
      responsePayload: JSON.stringify({ id: "123456" }),
      webhookResponsePayload: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.pagamento.findUnique).mockResolvedValue(pagamento);

    const result = await repository.findByIdPedidoAsync(pagamento.idPedido);
    expect(prisma.pagamento.findUnique).toHaveBeenCalledWith({
      where: { idPedido: pagamento.idPedido },
    });
    expect(result).toEqual(pagamento);
  });

  it("Deve cadastrar pagamento corretamente", async () => {
    const pagamento = {
      id: "123465-abv",
      idPedido: 1234,
      valor: 5.5,
      paymentId: 123456,
      paymentStatus: StatusPagamento.aguardando,
      responsePayload: JSON.stringify({ id: "123456" }),
      webhookResponsePayload: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.pagamento.create).mockResolvedValue(pagamento);

    const result = await repository.createAsync(pagamento);
    expect(prisma.pagamento.create).toHaveBeenCalledWith({ data: pagamento });

    expect(result).toEqual(pagamento);
  });

  it("deve atualizar um pagamento corretamente", async () => {
    const pagamento = {
      id: "123465-abv",
      idPedido: 1234,
      valor: 5.5,
      paymentId: 123456,
      paymentStatus: StatusPagamento.aguardando,
      responsePayload: JSON.stringify({ id: "123456" }),
      webhookResponsePayload: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.pagamento.findUnique).mockResolvedValue(pagamento);
    vi.mocked(prisma.pagamento.update).mockResolvedValue(pagamento);

    const result = await repository.updateStatusAsync(
      pagamento.idPedido,
      pagamento.paymentStatus
    );

    expect(prisma.pagamento.findUnique).toHaveBeenCalledWith({
      where: { idPedido: pagamento.idPedido },
    });

    expect(prisma.pagamento.update).toHaveBeenCalledWith({
      where: { id: pagamento.id },
      data: { paymentStatus: pagamento.paymentStatus },
    });

    expect(result).toEqual(pagamento);
  });
});
