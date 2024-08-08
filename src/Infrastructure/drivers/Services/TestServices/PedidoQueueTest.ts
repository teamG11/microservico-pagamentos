import {
  IPedidoMessage,
  IPedidoQueue,
} from "@/Interfaces/Services/IPedidoQueue";

export default class PedidoQueueTest implements IPedidoQueue {
  async sendPedidoMessage(pedidoMessage: IPedidoMessage): Promise<void> {
    console.log("Order message sent successfully:", pedidoMessage);
  }
}
