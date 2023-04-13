const fs = require("fs");
const {
  formatRule,
  formatNat,
  formatAlias,
} = require("./util/formatFunctions");
const {
  resetDirectories,
  convert2JSON,
  returnValue,
  makeFile,
} = require("./util/helperFunctions");
const config = require("./config");

// Környezet beállitása
const inputURL =
  parseInt(process.env.SANDBOX) === 1
    ? config.sandboxInputURL
    : config.inputURL;
const outputURL =
  parseInt(process.env.SANDBOX) === 1
    ? config.sandboxOutputURL
    : config.outputURL;

// Output könyvtárak resetelése
resetDirectories(outputURL);

fs.readdirSync(inputURL).forEach((file) => {
  const jsonObject = convert2JSON(`${inputURL}/${file}`);
  const { system, nat, filter, aliases } = jsonObject.pfsense;
  const hostname = returnValue(system.hostname);

  let aliasArray = [];
  aliases.alias.forEach((alias) => {
    aliasArray = [...aliasArray, ...formatAlias(alias)];
  });

  const rules = filter.rule.map((rule, index) => formatRule(rule, index));

  const natRules = [];
  const outbound = nat.outbound;
  const advancedoutbound = nat.advancedoutbound;
  const inbound = nat.rule;

  inbound.forEach((rule) => {
    natRules.push(formatNat(rule, "Inbound"));
  });

  if (outbound) {
    outbound.rule.forEach((rule) => {
      natRules.push(formatNat(rule, "Outbound"));
    });
  }

  if (advancedoutbound) {
    advancedoutbound.rule.forEach((rule) => {
      natRules.push(formatNat(rule, "Advanced outbound"));
    });
  }

  // Output files
  const fwFile = `${outputURL}/fw/FW_${hostname}.csv`;
  const natFile = `${outputURL}/nat/NAT_${hostname}.csv`;
  const aliasFile = `${outputURL}/aliases/ALIAS_${hostname}.csv`;

  Promise.all([
    makeFile(aliasArray, aliasFile),
    makeFile(rules, fwFile),
    makeFile(natRules, natFile),
  ]).then(() => {
    console.log(`${hostname} ✅`);
  });
});
