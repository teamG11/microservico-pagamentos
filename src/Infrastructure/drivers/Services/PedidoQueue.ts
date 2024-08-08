import { env } from "@/Infrastructure/env";
import {
  IPedidoMessage,
  IPedidoQueue,
} from "@/Interfaces/Services/IPedidoQueue";
import AWS from "aws-sdk";

export default class PedidoQueue implements IPedidoQueue {
  private sqs = new AWS.SQS({
    region: env.AWS_REGION,
    endpoint: "http://localstack:4566",
  });

  async sendPedidoMessage(pedidoMessage: IPedidoMessage): Promise<void> {
    const params: AWS.SQS.SendMessageRequest = {
      QueueUrl: env.PEDIDO_QUEUE_URL,
      MessageBody: JSON.stringify(pedidoMessage),
    };

    try {
      const data = await this.sqs.sendMessage(params).promise();
      console.log("Order message sent successfully:", data.MessageId);
    } catch (error) {
      console.error("Error sending order message:", error);
    }
  }
}
