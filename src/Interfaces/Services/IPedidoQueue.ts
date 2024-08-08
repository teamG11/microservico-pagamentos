export interface IPedidoMessage {
  id: string;
  status: string;
  statusPagamento: string;
}

export interface IPedidoQueue {
  sendPedidoMessage(pedidoMessage: IPedidoMessage): void;
}
