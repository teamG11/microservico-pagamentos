import { env } from "@/Infrastructure/env";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import AWS from "aws-sdk";
import PagamentoRepository from "../Repositories/PagamentoRepository";
import MercadoPagoService from "./MercadoPagoService";
import PedidoQueue from "./PedidoQueue";

const sqs = new AWS.SQS({
  region: env.AWS_REGION,
  endpoint: "http://localstack:4566",
});

const queueUrl = env.PAGAMENTO_QUEUE_URL;

interface PagamentoMessage {
  id_pedido: number;
  id_cliente: number;
  valor_final: number;
}

const pagamentoController = new PagamentoController(
  new MercadoPagoService(),
  new PagamentoRepository(),
  new PedidoQueue()
);

const processMessages = async () => {
  try {
    const params: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log("Received message:", message.Body);

        // Parse the message body
        let parsedMessage: PagamentoMessage;
        try {
          parsedMessage = JSON.parse(message.Body!);
          console.log("Parsed message:", parsedMessage);

          // Access id and status
          const { id_pedido, id_cliente, valor_final } = parsedMessage;
          console.log(
            `id_pedido: ${id_pedido}, id_cliente: ${id_cliente}, valor_final: ${valor_final}`
          );

          await pagamentoController.criar(id_pedido, valor_final);

          // Delete the message after processing
          await sqs
            .deleteMessage({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();

          console.log("Message processed and deleted");
        } catch (error) {
          console.error("Error parsing message:", error);
          await sqs
            .deleteMessage({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
        }
      }
    }
  } catch (error) {
    console.error("Error processing messages:", error);
  }
};

export const startPolling = () => {
  setInterval(async () => {
    await processMessages();
  }, 5000);
};
