export class PedidoPagamento {
  id: string = "";

  constructor(
    public idPedido: number,
    public valor: number,
    public statusPagamento: string,
    public idPagamento: string
  ) {}
}
