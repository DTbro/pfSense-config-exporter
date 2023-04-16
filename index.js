const fs = require("fs");
const {
  firewallModule,
  dhcpModule,
  natModule,
  aliasModule,
  vpnModule,
} = require("./modules/modules");
const {
  resetDirectories,
  convert2JSON,
  returnValue,
} = require("./util/helperFunctions");
const { inputURL, outputURL } = require("./settings");

// Output könyvtárak resetelése
resetDirectories(outputURL);

fs.readdirSync(inputURL).forEach((file) => {
  const jsonObject = convert2JSON(`${inputURL}/${file}`);
  const { system, nat, filter, aliases, dhcpd, ipsec, openvpn } =
    jsonObject.pfsense;
  const hostname = returnValue(system.hostname);

  Promise.all([
    // firewallModule(filter.rule, hostname),
    // dhcpModule(dhcpd, hostname),
    // natModule(nat, hostname),
    // aliasModule(aliases, hostname),
    vpnModule(
      ipsec,
      openvpn["openvpn-server"],
      openvpn["openvpn-csc"],
      hostname
    ),
  ]).then(() => {
    console.log(`${hostname} ✅`);
  });
});
