const { ruleMap, natMap } = require("../maps/map");
const { selectOption, returnValue } = require("./helperFunctions");

const formatRule = (rule, index) => {
  let formattedRule = {
    Order: index + 1,
  };
  Object.keys(ruleMap).forEach((key) => {
    const path = ruleMap[key].path;
    let property = rule[path];

    if (Object.keys(ruleMap[key]).includes("options")) {
      const root = Object.keys(rule[path]);
      const options = ruleMap[key].options;
      property = { placeholder: selectOption(root, options) };
    }

    // Nested or Dynamic
    if (path.includes("/")) {
      const mainPart = path.split("/")[0];
      const subPart = path.split("/")[1];

      if (subPart === "dynamic") {
        if (key === "Source") {
          const type = formattedRule["Source Type"];
          property = rule.source[type];
        } else if ("Destination") {
          const type = formattedRule["Destination Type"];
          property = rule.destination[type];
        }
      } else {
        property = rule[mainPart][subPart];
      }
    }

    formattedRule = {
      ...formattedRule,
      [key]: property ? returnValue(property) : "-",
    };
  });

  return formattedRule;
};

const formatNat = (rule, type) => {
  let formattedRule = {
    Type: type,
  };

  Object.keys(natMap).forEach((key) => {
    const path = natMap[key].path;
    let property = rule[path];

    // Handle options
    if (Object.keys(natMap[key]).includes("options")) {
      const root = Object.keys(rule[path]);
      const options = natMap[key].options;
      property = { placeholder: selectOption(root, options) };
    }

    // Nested or Dynamic
    if (path.includes("/")) {
      const mainPart = path.split("/")[0];
      const subPart = path.split("/")[1];

      if (subPart === "dynamic") {
        if (key === "Source") {
          const type = formattedRule["Source Type"];
          property = rule.source[type];
        } else if ("Destination") {
          const type = formattedRule["Destination Type"];
          property = rule.destination[type];
        }
      } else {
        property = rule[mainPart][subPart];
      }
    }

    formattedRule = {
      ...formattedRule,
      [key]: property ? returnValue(property) : "-",
    };
  });

  return formattedRule;
};

const formatAlias = (alias) => {
  let formattedAliases = [];

  // Validation
  const keyExist = (key) => Object.keys(alias).includes(key);

  const addresses = returnValue(alias.address).split(" ");
  addresses.forEach((addr) => {
    formattedAliases.push({
      Name: keyExist("name") ? returnValue(alias.name) : "-",
      Type: keyExist("type") ? returnValue(alias.type) : "-",
      Address: addr,
      Description: keyExist("descr") ? returnValue(alias.descr) : "-",
    });
  });

  return formattedAliases;
};

const formatDHCP = (staticmaps) => {
  const formattedMaps = [];
  staticmaps.forEach((binding) => {
    formattedMaps.push({
      Hostname: returnValue(binding.hostname),
      MAC: returnValue(binding.mac),
      IP: returnValue(binding.ipaddr),
      Description: returnValue(binding.descr),
    })
  });

  return formattedMaps;
}

const generateScopeObject = (root) => ({
    "Start": returnValue(root.range.from),
    "End": returnValue(root.range.to),
    "Gateway": returnValue(root.gateway),
    "Default Lease Time": returnValue(root.defaultleasetime),
    "Max Lease Time": returnValue(root.maxleasetime),
    "Bindings": Array.isArray(root.staticmap) ? root.staticmap.length : 0
});

module.exports = {
  formatRule,
  formatNat,
  formatAlias,
  formatDHCP,
  generateScopeObject
};
