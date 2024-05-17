import { ApiError } from "./ApiError";

export class DadosInvalidosError extends ApiError {
  constructor() {
    super("Parametros da requisição inválidos.", 422);
  }
}
