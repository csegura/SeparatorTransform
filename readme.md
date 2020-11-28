# SeparatorTransform

StreamTransform is a stream reader that divide the entry in delimited parts, without buffering the files into memory.

## Install

```
npm install SeparatorTransform
```

## Usage:

Synchronous processing of lines:

The mudule include two class a low level SeparatorTransform that do the work and another that simplify the use `StreamSeparator`

example Divide reader entry line by line

```js
const reader = fs.createReadStream(fileName); // reader entry
const separator = new StreamSeparator({
  separator: /\r\n/g,
  omitChars: /\r\n/g,
});

await separator.read(
  reader,
  data => {
    // do something with data
    console.log(data);
  },
  () => {
    console.log("done");
  }
);
```

## Usage:

**Class: StreamSeparator({options})**

`options` is an object with the following defaults:

```js
{
  skipEmptyLines: true,
  separator: /\r\n/g,
  omits: /\|\r\n*$/,
}
```

**read(reader, onChunk, onFinish)**

`readrer` the entry stream
`onChunk` function to process chunk of data
`onFinish` function on finish

retruns a promise fulfilled when finish

**Class: SeparatorTransform({options})**

`options` same that StreamSeparator

use as any transfrom stream

```js
const trasform = new SeparatorTransform({
  skipEmptyLines: true,
  separator: /,\r\n/g, // divide entry in lines and , separator
  omits: /\|,\r\n*$/, // remove that characters
});
input.pipe(transform).pipe(output);
```

## License:

The MIT License (MIT)

© 2020 Carlos Segura
