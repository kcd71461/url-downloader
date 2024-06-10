import * as fs from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";

if (!fs.existsSync("setting.json")) {
  throw new Error("setting.json");
}

const setting = fs.readFileSync("setting.json", "utf-8");
const settingJson = JSON.parse(setting);
const { url, targetFileName } = settingJson as {
  url?: string;
  targetFileName?: string;
};

if (!url) {
  throw new Error("url is required");
}
if (!targetFileName) {
  throw new Error("targetFileName is required");
}

fetch(url).then(async (response) => {
  if (!response || !response.body) {
    return;
  }
  const stream = fs.createWriteStream(targetFileName);
  await finished(Readable.fromWeb(response.body as any).pipe(stream));
});
