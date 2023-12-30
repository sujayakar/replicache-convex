import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    localId: v.string(),
    sender: v.string(),
    content: v.string(),
    ord: v.number(),
    deleted: v.boolean(),
    version: v.number(),
  })
    .index("by_local_id", ["localId"])
    .index("by_version", ["version"]),

  replicacheClient: defineTable({
    clientId: v.string(),
    clientGroupId: v.string(),
    lastMutationId: v.number(),
    version: v.number(),
  })
    .index("by_client_id", ["clientId"])
    .index("by_client_group_id", ["clientGroupId", "version"]),

  replicacheServer: defineTable({
    serverId: v.string(),
    version: v.number(),
  }).index("by_server_id", ["serverId"]),
});
