import replicacheLogo from "./assets/replicache.svg";
import convexLogo from "/convex-logomark-1024.png";
import "./App.css";
import { Message } from "./replicache";
import { useSubscribe } from "replicache-react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { replicache } from "./main";

function App() {
  const messages = useSubscribe(
    replicache,
    async (tx) => {
      const list = await tx
        .scan<Message>({ prefix: "message/" })
        .entries()
        .toArray();
      list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    { default: [] },
  );

  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = (e: any) => {
    if (!userName || !content) {
      return;
    }
    e.preventDefault();
    const order = messages.length
      ? messages[messages.length - 1][1].order + 1
      : 0;
    replicache.mutate.createMessage({
      id: nanoid(),
      from: userName,
      content,
      order,
    });
    setContent("");
  };
  return (
    <>
      <div>
        <a href="https://replicache.dev" target="_blank">
          <img src={replicacheLogo} className="logo" alt="Replicache logo" />
        </a>
        <a href="https://convex.dev.dev" target="_blank">
          <img src={convexLogo} className="logo react" alt="Convex logo" />
        </a>
      </div>
      <h1>Replicache + Convex</h1>
      <div className="card">
        <div>
          <form onSubmit={onSubmit}>
            <input
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />{" "}
            says:{" "}
            <input
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input type="submit" />
          </form>
          <MessageList messages={messages} />
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Replicache and Convex logos to learn more.
      </p>
    </>
  );
}

function MessageList({
  messages,
}: {
  messages: (readonly [string, Message])[];
}) {
  return messages.map(([k, v]) => {
    return (
      <div key={k}>
        <b>{v.from}: </b>
        {v.content}
      </div>
    );
  });
}

export default App;
