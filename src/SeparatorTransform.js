const { Transform } = require("stream");

const SEPARATOR = /\r\n/g;
const OMITSCHARS = /\|\r\n*$/;

class SeparatorTransform extends Transform {
  constructor(options) {
    super();
    const { separator, omitChars, skipEmptyLines } = options || {};

    this.separator = separator || SEPARATOR;
    this.omitsChars = omitChars || OMITSCHARS;
    this.skipEmptyLines = skipEmptyLines || true;
    this.lines = [];
    this.fragment = "";
    this.counter = 0;
  }

  _transform(chunk, enc, next) {
    chunk = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;

    this.lines = this.lines.concat(chunk.split(this.separator));

    this.lines[0] = this.fragment + this.lines[0];
    this.fragment = this.lines.pop() || "";
    this.send();
    next();
  }

  send() {
    this.lines.forEach(line => this._emitData(line));
    this.lines = [];
  }

  _emitData(line) {
    if (!this.skipEmptyLines || line.length > 0) {
      line = line.replace(this.omitsChars, "");
      this.emit("data", line);
      this.counter += 1;
    }
  }

  _flush(next) {
    if (this.fragment) this._emitData(this.fragment);
    next();
  }
}

module.exports = exports.default = SeparatorTransform;
