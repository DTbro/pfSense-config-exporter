const path = require("path");
const settings = require("../settings");
const { formatRule } = require("../util/formatFunctions");
const { makeFile } = require("../util/helperFunctions");

const firewallModule = (rules, hostname) => {
  return new Promise((resolve) => {
    const outputSource = rules.map((rule, index) => formatRule(rule, index));
    const outputFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/fw/FW_${hostname}.csv`
    );

    makeFile(outputSource, outputFile).then(() => {
      resolve();
    });
  });
};

module.exports = firewallModule;
