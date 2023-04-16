const config = require("./config");
const { SANDBOX } = process.env;

const settings = {
  inputURL: parseInt(SANDBOX) === 1 ? config.sandboxInputURL : config.inputURL,
  outputURL:
    parseInt(SANDBOX) === 1 ? config.sandboxOutputURL : config.outputURL,
};

module.exports = settings;
