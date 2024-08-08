import { env } from "@/Infrastructure/env";
import AWS from "aws-sdk";

const sqs = new AWS.SQS({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT,
});

interface PedidoMessage {
  id: string;
  status: string;
  statusPagamento: string;
}

export const sendPedidoMessage = async (pedidoMessage: PedidoMessage) => {
  const params: AWS.SQS.SendMessageRequest = {
    QueueUrl: env.PEDIDO_QUEUE_URL,
    MessageBody: JSON.stringify(pedidoMessage),
  };

  try {
    const data = await sqs.sendMessage(params).promise();
    console.log("Order message sent successfully:", data.MessageId);
  } catch (error) {
    console.error("Error sending order message:", error);
  }
};
