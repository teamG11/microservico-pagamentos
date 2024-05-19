import { operacoes } from "@/Infrastructure/lib/operacoes";
import { IOperacoesMicroserviceApi } from "@/Interfaces/Services/IOperacoesMicroserviceApi";

export default class OperacoesMicroserviceApi
  implements IOperacoesMicroserviceApi
{
  async updateStatusPagamentoAsync(
    idPedido: number,
    status: string
  ): Promise<void> {
    await operacoes.put(idPedido + "/status", {
      idPedido: idPedido,
      status: status,
    });
  }
}
