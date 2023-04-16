const path = require("path");
const settings = require("../settings");
const { formatOVPN, formatIPSec } = require("../util/formatFunctions");
const { makeFile } = require("../util/helperFunctions");

const vpnModule = (ipsec, servers, clients, hostname) => {
  return new Promise((resolve) => {
    const { phase1, phase2 } = ipsec;

    const ipsecOutputSource = formatIPSec(phase1, phase2);
    const ipsecOutputFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/vpn/ipsec/IPSEC_${hostname}.csv`
    );

    const ovpnOutputSource = formatOVPN(servers, clients);
    const ovpnOutputFile = path.join(
      __dirname,
      "..",
      `${settings.outputURL}/vpn/openvpn/OVPN_${hostname}.csv`
    );

    Promise.all([
      makeFile(ovpnOutputSource, ovpnOutputFile),
      makeFile(ipsecOutputSource, ipsecOutputFile),
    ]).then(() => {
      resolve();
    });
  });
};

module.exports = vpnModule;
