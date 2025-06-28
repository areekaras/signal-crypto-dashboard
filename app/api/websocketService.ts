interface TickerMessage {
  type: "ticker";
  product_id: string;
  price: string;
  open_24h: string;
}

// This defines the function signature for our callback
type TickerCallback = (
  productId: string,
  newPrice: string,
  priceChangePercentage24h: string
) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly WS_URL = "wss://ws-feed.exchange.coinbase.com";

  connect(productIds: string[], callback: TickerCallback): void {
    // If there's an existing connection, close it before creating a new one
    if (this.ws) {
      this.disconnect();
    }

    // Use the global WebSocket constructor provided by React Native
    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => {
      console.log("[WebSocket] Connection established.");
      const subscribeMessage = {
        type: "subscribe",
        product_ids: productIds,
        channels: ["ticker"],
      };
      this.ws?.send(JSON.stringify(subscribeMessage));
    };

    this.ws.onmessage = (event) => {
      // The event data is a string, so we need to parse it as JSON
      const message: TickerMessage = JSON.parse(event.data);

      // Make sure the message is a ticker update and has the required fields
      if (message.type === "ticker" && message.price && message.open_24h) {
        const newPrice = parseFloat(message.price);
        const open24h = parseFloat(message.open_24h);

        let priceChangePercentage = 0;
        if (open24h !== 0) {
          priceChangePercentage = ((newPrice - open24h) / open24h) * 100;
        }

        // Invoke the callback with the data, formatting numbers to strings as needed
        callback(
          message.product_id,
          message.price,
          priceChangePercentage.toFixed(2) // Format to 2 decimal places
        );
      }
    };

    this.ws.onerror = (error) => {
      // The error event in the built-in WebSocket doesn't give a detailed object
      // so we just log a generic message.
      console.error("[WebSocket] An error occurred:", error);
    };

    this.ws.onclose = () => {
      console.log("[WebSocket] Connection closed.");
    };
  }

  disconnect(): void {
    if (this.ws) {
      // The WebSocket close method is standard.
      this.ws.close();
      this.ws = null;
    }
  }
}
