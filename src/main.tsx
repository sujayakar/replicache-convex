import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ConvexClient } from "convex/browser";
import { createReplicacheClient } from "./replicache.ts";

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);
export const replicache = createReplicacheClient(convex);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
