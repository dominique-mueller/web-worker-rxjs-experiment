declare const self: Worker;
export default {} as typeof Worker & { new (): Worker };

import { expose, proxy } from "comlink";
import { interval, Subscription, Subject } from "rxjs";
import { tap, share } from "rxjs/operators";
import { WorkerSubject } from "./subject/WorkerSubject";

console.log("[WORKER] Script is running.");

// Announce readiness
self.postMessage("READY");

const subject = new WorkerSubject<number>();
// subject.subscribe((value: number): void => {
//   console.log(`[WORKER] ${value}`);
// });

let i = 0;
setInterval(() => {
  subject.next(i);
  i++;
}, 1000);

// const stream = interval(1000).pipe(
//   tap((count: number) => {
//     console.log("[WORKER] Interval emitted.", count);
//   })
//   share(),
// );

// stream.subscribe(number => {
//   console.log(number);
// });

const api = {
  testSubject: subject
  // next: (value: any) => {
  //   console.log('NEXT VALUE', value);
  // },
  // subscribe: (callback: any) => {
  //   const callbackProxy = (...args: any) => {
  //     callback(...args);
  //   };
  //   const subscription: Subscription = stream.subscribe(callbackProxy);
  //   const unsubscribeProxy = () => {
  //     return subscription.unsubscribe();
  //   };
  //   return proxy(unsubscribeProxy);
  // }
};

expose(api, self);
