import { IMercadoPagoService } from "../../Services/IMercadoPagoService";

export interface IOperacoesMicroserviceGateway {
  updateStatusPagamentoAsync(idPedido: number, status: string): Promise<void>;
}

export default class OperacoesMicroserviceGateway
  implements IOperacoesMicroserviceGateway
{
  constructor(private mercadoPagoService: IMercadoPagoService) {}
  updateStatusPagamentoAsync(idPedido: number, status: string): Promise<void> {
    throw new Error("Method not implemented. " + idPedido + status);
  }
}
