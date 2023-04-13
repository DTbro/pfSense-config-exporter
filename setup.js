const fs = require("fs");
const config = require("./config");

const { inputURL, outputURL, sandboxRoot, sandboxInputURL, sandboxOutputURL } =
  config;

// Csekk hogy az adat könyvtárak megvannak-e
if (!fs.existsSync(inputURL)) {
  fs.mkdirSync(inputURL);
}

if (!fs.existsSync(outputURL)) {
  fs.mkdirSync(outputURL);
}

if (!fs.existsSync(sandboxRoot)) {
  fs.mkdirSync(sandboxRoot);
}

if (!fs.existsSync(sandboxInputURL)) {
  fs.mkdirSync(sandboxInputURL);
}

if (!fs.existsSync(sandboxOutputURL)) {
  fs.mkdirSync(sandboxOutputURL);
}
