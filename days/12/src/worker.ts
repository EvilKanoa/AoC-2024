import { SpringRow, countValidArrangements } from "./solve";

declare var self: Worker;

self.addEventListener("message", (event: MessageEvent<SpringRow>) => {
  self.postMessage(countValidArrangements(event.data));
});
