const firewallModule = require("./firewall.module");
const natModule = require("./nat.module");
const dhcpModule = require("./dhcp.module");
const aliasModule = require("./alias.module");
const vpnModule = require("./vpn.module");

module.exports = {
  firewallModule,
  natModule,
  dhcpModule,
  aliasModule,
  vpnModule,
};
