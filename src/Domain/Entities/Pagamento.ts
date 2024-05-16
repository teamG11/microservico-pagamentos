export class Pagamento {
  id?: string;

  constructor(
    public paymentId: number | null,
    public paymentStatus: string | null,
    public requestPayload: string,
    public responsePayload: string,
    public webhookResponsePayload: string | null = null
  ) {}
}
