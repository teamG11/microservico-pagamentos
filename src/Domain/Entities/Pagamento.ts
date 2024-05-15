export class Pagamento {
  id?: string;

  constructor(
    public requestPayload: string,
    public responsePayload: string,
    public webhookResponsePayload: string | null
  ) {}
}
