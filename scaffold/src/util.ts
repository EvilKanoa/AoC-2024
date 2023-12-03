import { file } from "bun";

export const updateFileWithReplace = async (
  fileName: string,
  replacements: Record<string, string>
): Promise<void> => {
  let contents = await file(fileName).text();
  for (let [needle, replacement] of Object.entries(replacements)) {
    contents = contents.replaceAll(needle, replacement);
  }

  const writer = file(fileName).writer();
  writer.write(contents);
  await writer.end();
};

export const keysInParallel = async <T extends Record<string, Promise<any>>>(
  promiseObj: T
): Promise<{ [key in keyof T]: Awaited<T[key]> }> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(promiseObj).map(([key, value]) =>
        value.then((val) => [key, val])
      )
    )
  );

export const asComment = (text: string) =>
  text
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
