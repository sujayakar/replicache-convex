import { ConvexClient } from "convex/browser";
import { Replicache, WriteTransaction } from "replicache";
import { ConvexReplicacheClient } from "./ConvexReplicacheClient";
import { MessageWithID } from "../convex/types";

const mutators = {
  async createMessage(
    tx: WriteTransaction,
    { id, from, content, order }: MessageWithID,
  ) {
    await tx.set(`message/${id}`, { from, content, order });
  },
};

export function createReplicacheClient(convex: ConvexClient) {
  const convexBridge = new ConvexReplicacheClient(convex);
  const replicache = new Replicache({
    name: "replicache-convex",
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    mutators,
    pusher: (body, id) => convexBridge.replicachePush(body as any, id),
    puller: (body, id) => convexBridge.replicachePull(body as any, id),
  });
  const unsubscribe = convexBridge.subscribe(replicache);
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      replicache.close();
      unsubscribe();
    });
  }
  return replicache;
}
