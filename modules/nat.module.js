const path = require("path");
const settings = require("../settings");
const { formatNat } = require("../util/formatFunctions");
const { makeFile } = require("../util/helperFunctions");

const natModule = (nat, hostname) => {
  return new Promise((resolve) => {
    const outputSource = [];
    const outbound = nat.outbound;
    const advancedoutbound = nat.advancedoutbound;
    const inbound = nat.rule;

    inbound.forEach((rule) => {
      outputSource.push(formatNat(rule, "Inbound"));
    });

    if (outbound) {
      outbound.rule.forEach((rule) => {
        outputSource.push(formatNat(rule, "Outbound"));
      });
    }

    if (advancedoutbound) {
      advancedoutbound.rule.forEach((rule) => {
        outputSource.push(formatNat(rule, "Advanced outbound"));
      });
    }

    const outputFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/nat/NAT_${hostname}.csv`
    );
    makeFile(outputSource, outputFile).then(() => {
      resolve();
    });
  });
};

module.exports = natModule;
