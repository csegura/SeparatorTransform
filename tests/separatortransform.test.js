const SeparatorTransform = require("../src/SeparatorTransform");
const MemoryWriteStream = require("./MemoryWriteStream");
const { PassThrough } = require("stream");
const { write } = require("fs");

describe("SeparatorTransform", () => {
  test("transform all", () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /\n/g,
      omitChars: /\n/g,
    });
    const writeStream = new MemoryWriteStream();

    //transform.on("error", err => console.log(err));

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual(["foo", "bar", "baz"]);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.write(Buffer.from("foo\nba"));
    readStream.write("r\n");
    readStream.end(Buffer.from("\nbaz"));
  });

  test("transform get data", () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /\n/g,
      omitChars: /\n/g,
    });
    const writeStream = new MemoryWriteStream();

    let lineCounter = 0;
    let lines = [];

    writeStream.on("data", data => {
      lines.push(data);
      lineCounter += 1;
    });

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual(["foo", "bar", "baz"]);
      expect(writeStream.data).toEqual(lines);
      expect(3).toEqual(lineCounter);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.write(Buffer.from("foo\nba"));
    readStream.write("r\n");
    readStream.end(Buffer.from("\nbaz"));
  });

  test("transform get data crlf", () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /\r\n/g,
      omitChars: /\r\n/g,
    });
    const writeStream = new MemoryWriteStream();

    let lineCounter = 0;
    let lines = [];

    writeStream.on("data", data => {
      lines.push(data);
      lineCounter += 1;
    });

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual(["foo", "bar", "other", "baz"]);
      expect(writeStream.data).toEqual(lines);
      expect(4).toEqual(lineCounter);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.write(Buffer.from("foo\r\nba"));
    readStream.write("r\r\nother");
    readStream.end(Buffer.from("\r\nbaz"));
  });

  test("transform utf-8", () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /\r\n/g,
      omitChars: /\r\n/g,
      encoding: "utf-8",
    });
    const writeStream = new MemoryWriteStream();

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual([
        "((V⍳V)=⍳⍴V)←",
        "κόκκαλα",
        "გთხოვთ",
        "Интернета",
        "áéíóú",
      ]);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.write(Buffer.from("((V⍳V)=⍳⍴V)←\r\nκόκκαλα"));
    readStream.write("\r\nგთხოვთ\r\nИнтернета");
    readStream.end(Buffer.from("\r\náéíóú"));
  });

  test("transform latin1", () => {
    const readStream = new PassThrough();
    const transform = new SeparatorTransform({
      separator: /\r\n/g,
      omitChars: /\r\n/g,
      encoding: "utf-8",
    });
    const writeStream = new MemoryWriteStream();

    writeStream.on("finish", () => {
      expect(writeStream.data).toEqual(["áéíóú&", "cumplirán"]);
    });

    readStream.pipe(transform).pipe(writeStream);

    readStream.write("áéíóú&\r\n".toString("latin1"));
    readStream.end("\r\ncumplirán".toString("latin1"));
  });
});
