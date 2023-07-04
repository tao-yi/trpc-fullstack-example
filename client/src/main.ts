import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { AppRouter } from "../../server/api";

const wsClient = createWSClient({
  url: "ws://localhost:3000/trpc",
});

const client = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
        headers: {
          Authorization: "Bearer",
        },
      }),
    }),
  ],
});

document.addEventListener("click", () => {
  client.users.update.mutate({ userId: "1", name: "kyle" });
});

async function main() {
  // const result = await client.logToServer.mutate("hi from server");
  // console.log(result);
  // const user = await client.users.get.query({ userId: "1234" });
  // console.log(user);
  // const res = await client.users.update.mutate({
  //   name: "new name",
  //   userId: "1234",
  // });
  // console.log(res);
  // console.log(await client.secretData.query());

  const connection = client.users.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log("updated", id);
    },
  });

  // connection.unsubscribe()
  wsClient.close();
}

main();
