import app from "./app";
import { startPolling } from "./Infrastructure/drivers/Services/PagamentoQueue";
import { env } from "./Infrastructure/env";

app.listen(env.PORT, () => {
  console.log(`💻 Listening on port ${env.PORT}`);
  startPolling();
});
