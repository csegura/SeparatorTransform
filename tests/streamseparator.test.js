const StreamSeparator = require("../src/StreamSeparator");
const fs = require("fs");

const file = "./tests/latin1.txt";

describe("StreamSeparator test", () => {
  test("read and transform", () => {
    const reader = fs.createReadStream(file);
    const separator = new StreamSeparator({
      separator: /\r\n/g,
      omitChars: /\r\n/g,
    });

    let counter = 0;

    separator.read(
      reader,
      data => {
        counter += 1;
      },
      () => {
        expect(counter).toBe(23);
      }
    );
  });
});
