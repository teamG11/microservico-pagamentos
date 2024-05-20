import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import MercadoPagoService from "@/Infrastructure/drivers/Services/MercadoPagoService";
import { env } from "@/Infrastructure/env";
import { mercadoPagoPagamentos } from "@/Infrastructure/lib/mercadoPago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/Infrastructure/lib/mercadoPago", () => ({
  mercadoPagoPagamentos: {
    create: vi.fn(),
    get: vi.fn(),
  },
}));

describe("MercadoPagoGateway", () => {
  let mercadoPagoService: MercadoPagoService;

  beforeEach(() => {
    vi.clearAllMocks();
    mercadoPagoService = new MercadoPagoService();
  });

  it("Deve cadastrar um payment corretamente", async () => {
    const payment: PaymentResponse = {
      api_response: { status: 200, headers: ["", [""]] },
      id: 222,
      transaction_amount: 5.5,
      description: "Pedido de lanche nro 111",
      payment_method_id: env.NODE_ENV == "dev" ? "pix" : "Pix",
      external_reference: "111",
      status: StatusPagamento.aguardando,
      payer: {
        email: "financeiro@lanchonete.com",
        identification: {
          type: "CPF",
          number: "28254905045",
        },
      },
    };

    vi.mocked(mercadoPagoPagamentos.create).mockResolvedValue(payment);
    const result = await mercadoPagoService.createAsync(5.5, 111);
    expect(mercadoPagoPagamentos.create).toHaveBeenCalled();
    expect(result).toEqual(payment);
  });

  it("deve encontrar um payment por id corretamente", async () => {
    const payment: PaymentResponse = {
      api_response: { status: 200, headers: ["", [""]] },
      id: 222,
      transaction_amount: 5.5,
      description: "Pedido de lanche nro 111",
      payment_method_id: env.NODE_ENV == "dev" ? "pix" : "Pix",
      external_reference: "111",
      status: StatusPagamento.aguardando,
      payer: {
        email: "financeiro@lanchonete.com",
        identification: {
          type: "CPF",
          number: "28254905045",
        },
      },
    };
    vi.mocked(mercadoPagoPagamentos.get).mockResolvedValue(payment);

    const result = await mercadoPagoService.findByIdAsync(Number(payment.id));
    expect(mercadoPagoPagamentos.get).toHaveBeenCalled();
    expect(result).toEqual(payment);
  });
});
