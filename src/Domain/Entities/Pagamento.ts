export class Pagamento {
  id?: string;

  constructor(
    public idPedido: number,
    public valor: number,
    public paymentId: number,
    public paymentStatus: string,
    public responsePayload: string,
    public webhookResponsePayload: string | null = null
  ) {}
}
