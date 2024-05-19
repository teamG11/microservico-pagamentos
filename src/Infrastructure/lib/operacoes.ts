import axios from "axios";
import { env } from "../env";

export const operacoes = axios.create({
  baseURL: env.MICROSERVICO_OPERACAO_URL,
});
