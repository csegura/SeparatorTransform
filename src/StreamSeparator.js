const SeparatorTransform = require("./SeparatorTransform");
const WritePassStream = require("./WritePassStream");

class StreamSeparator {
  constructor(options) {
    this.transform = new SeparatorTransform(options);
    this.passStream = new WritePassStream();
    this.lines = 0;
  }

  _read(stream, dataCallback, finishCallback) {
    this.passStream.on("data", dataCallback);
    this.passStream.on("finish", finishCallback);
    stream.pipe(this.transform).pipe(this.passStream);
  }

  read(stream, dataCallback, finishCallback) {
    this._read(stream, dataCallback, finishCallback);
    return this.waitEvent(this.passStream, "finish");
  }

  waitEvent(emitter, event) {
    return new Promise((resolve, reject) => {
      const success = val => {
        emitter.off("error", fail);
        resolve(val);
      };
      const fail = err => {
        emitter.off(event, success);
        reject(err);
      };
      emitter.once(event, success);
      emitter.once("error", fail);
    });
  }
}

module.exports = StreamSeparator;
