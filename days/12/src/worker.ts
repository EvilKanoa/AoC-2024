import { MEMO_KEY_CACHE, MEMO_KEY_UPDATE } from "shared";
import { SpringRow, countFrom } from "./solve";

declare var self: Worker;

self.addEventListener(
  "message",
  (event: MessageEvent<[SpringRow, Map<string, number>]>) => {
    countFrom[MEMO_KEY_UPDATE](event.data[1]);
    self.postMessage([
      event.data[0].key,
      countFrom(event.data[0].conditions, event.data[0].groups),
      countFrom[MEMO_KEY_CACHE],
    ]);
  }
);
