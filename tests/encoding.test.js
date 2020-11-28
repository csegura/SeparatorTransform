const SeparatorTransform = require("../src/SeparatorTransform");
const MemoryWriteStream = require("../tests/MemoryWriteStream");
const { PassThrough } = require("stream");

const latin1Text = Buffer.from([0xf3, 0xfa, 0xed, 0xe1]);
const utf8Text = Buffer.from([0xd0, 0x9f, 0xf0, 0x9f, 0x98, 0x8a]);

describe("Transform latin1 encoding", () => {
  test("latin1 encoding", async () => {
    const readStream = new PassThrough({ encoding: "latin1" });
    const transform = new SeparatorTransform({
      separator: /,/g,
      omitChars: /,/g,
    });

    const writeStream = new MemoryWriteStream();

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual([latin1Text.toString("latin1")]);
      console.log(writeStream.data);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.end(latin1Text);
  });

  test("utf-8 encoding (default)", async () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /,/g,
      omitChars: /,/g,
    });

    const writeStream = new MemoryWriteStream();

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual([utf8Text.toString()]);
      console.log(writeStream.data);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.end(utf8Text);
  });
});
