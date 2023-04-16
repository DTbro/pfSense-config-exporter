const path = require("path");
const settings = require("../settings");
const { formatAlias } = require("../util/formatFunctions");
const { makeFile } = require("../util/helperFunctions");

const aliasModule = (aliases, hostname) => {
  return new Promise((resolve) => {
    let outputSource = [];
    aliases.alias.forEach((alias) => {
      outputSource = [...outputSource, ...formatAlias(alias)];
    });

    const outputFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/aliases/ALIAS_${hostname}.csv`
    );
    makeFile(outputSource, outputFile).then(() => {
      resolve();
    });
  });
};

module.exports = aliasModule;
