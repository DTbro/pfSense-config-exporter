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
    });
  });

  return formattedMaps;
};

const generateScopeObject = (root) => ({
  Start: returnValue(root.range.from),
  End: returnValue(root.range.to),
  Gateway: returnValue(root.gateway),
  "Default Lease Time": returnValue(root.defaultleasetime),
  "Max Lease Time": returnValue(root.maxleasetime),
  Bindings: Array.isArray(root.staticmap) ? root.staticmap.length : 0,
});

const formatOVPN = (vpnServers, vpnClients) => {
  if (!vpnClients) {
    return [];
  }

  if (!Array.isArray(vpnClients)) {
    vpnClients = [vpnClients];
  }
  const formattedVPNClients = [];

  vpnClients.forEach((client) => {
    const server = vpnServers.find(
      (vpnServer) =>
        returnValue(vpnServer.vpnid) === returnValue(client.server_list)
    );

    if (server) {
      formattedVPNClients.push({
        "Server ID": returnValue(server.vpnid),
        "Server Description": returnValue(server.description),
        "Server Interface": returnValue(server.interface).replace(
          "lo",
          "Loopback"
        ),
        "Server Port": returnValue(server.local_port),
        Protocol: returnValue(server.protocol),
        "Tunnel Network": returnValue(server.tunnel_network),
        "Local Network": returnValue(server.local_networl),
        "Client Name": returnValue(client.common_name),
        "Client Description": returnValue(client.description),
        "Client Address": returnValue(client.tunnel_network),
      });
    }
  });

  return formattedVPNClients;
};

const formatIPSecP1 = (phase1s) => {
  return phase1s.map((endpoint) => ({
    ID: returnValue(endpoint.ikeid),
    Megnevezes: returnValue(endpoint.descr),
    Local: returnValue(endpoint.myid_data),
    Peer: returnValue(endpoint.peerid_data),
    "Authentication Method": returnValue(endpoint.authentication_method),
    "Key Exchange encryption":
      returnValue(endpoint.encryption.item["encryption-algorithm"].name) +
      returnValue(endpoint.encryption.item["encryption-algorithm"].keylen),
    "Data integrity": returnValue(endpoint.encryption.item["hash-algorithm"]),
    "Diffie-Hellmann group": returnValue(endpoint.encryption.item["dhgroup"]),
    "IKE Lifetime": returnValue(endpoint.lifetime),
    "IKE Type": returnValue(endpoint.iketype),
    "NAT Traversal": returnValue(endpoint.nat_traversal),
  }));
};

const formatIPSecP2 = (phase2s) => {
  return phase2s.map((endpoint) => ({
    p1id: returnValue(endpoint.ikeid),
    "P2 Description": returnValue(endpoint.descr),
    Protocol: returnValue(endpoint.protocol),
    "P2 Data integrity": returnValue(endpoint["hash-algorithm-option"]),
    Encryption:
      returnValue(endpoint["encryption-algorithm-option"].name) +
      returnValue(endpoint["encryption-algorithm-option"].keylen),
    "SA Lifetime": returnValue(endpoint.lifetime),
    "Local Subnets":
      returnValue(endpoint.localid.type) !== "network"
        ? returnValue(endpoint.localid.type)
        : `${returnValue(endpoint.localid.address)}/${returnValue(
            endpoint.localid.netbits
          )}`,
    "Remote subnets": `${returnValue(endpoint.remoteid.address)}/${returnValue(
      endpoint.remoteid.netbits
    )}`,
  }));
};

const formatIPSec = (phase1s, phase2s) => {
  const p1s = formatIPSecP1(phase1s);
  const p2s = formatIPSecP2(phase2s);

  const ipsecs = [];
  p2s.forEach((p2) => {
    const relatedP1 = p1s.find((p1) => p1.ID === p2.p1id);
    if (relatedP1) {
      delete relatedP1.ID;
      delete p2.p1id;
      ipsecs.push({ ...relatedP1, ...p2 });
    }
  });

  return ipsecs;
};

module.exports = {
  formatRule,
  formatNat,
  formatAlias,
  formatDHCP,
  generateScopeObject,
  formatOVPN,
  formatIPSec,
};
