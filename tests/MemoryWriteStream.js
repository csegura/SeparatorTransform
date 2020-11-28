const { Writable } = require("stream");

class MemoryWriteStream extends Writable {
  constructor(options) {
    super({ objectMode: true, ...options });
    this._results = [];
  }

  get data() {
    return this._results;
  }

  _write(data, _, cb) {
    this._results.push(data);
    this.emit("data", data);
    cb();
  }
}

module.exports = MemoryWriteStream;
