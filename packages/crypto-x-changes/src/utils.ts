export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const notImplementedFn: (...args: any[]) => any = () =>
  new Error("Not implemented");
export const notImplementedAsyncFn: (...args: any[]) => any = async () =>
  new Error("Not implemented");
