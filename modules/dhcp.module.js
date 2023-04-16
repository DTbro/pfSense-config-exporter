const path = require("path");
const settings = require("../settings");
const { formatDHCP, generateScopeObject } = require("../util/formatFunctions");
const { makeFile } = require("../util/helperFunctions");

const dhcpModule = (dhcpd, hostname) => {
  return new Promise((resolve) => {
    let staticmaps = [];
    let dhcpScopes = [];
    Object.keys(dhcpd).forEach((key) => {
      if (Array.isArray(dhcpd[key].staticmap)) {
        staticmaps = [...staticmaps, ...dhcpd[key].staticmap];
      }
      const scopeObject = generateScopeObject(dhcpd[key]);
      if (scopeObject.Start !== "-") {
        dhcpScopes.push(scopeObject);
      }
    });
    const dhcpBindings = formatDHCP(staticmaps);

    const dhcpScopeFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/dhcp/scopes/SCOPES_${hostname}.csv`
    );
    const dhcpBindingFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/dhcp/bindings/BINDING_${hostname}.csv`
    );

    Promise.all([
      makeFile(dhcpScopes, dhcpScopeFile),
      makeFile(dhcpBindings, dhcpBindingFile),
    ]).then(() => {
      resolve();
    });
  });
};

module.exports = dhcpModule;
