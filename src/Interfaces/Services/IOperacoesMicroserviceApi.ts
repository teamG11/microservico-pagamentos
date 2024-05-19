export interface IOperacoesMicroserviceApi {
  updateStatusPagamentoAsync(idPedido: number, status: string): Promise<void>;
}
