const ruleMap = {
  Action: {
    path: "type",
  },
  Disabled: {
    path: "disabled",
  },
  Interface: {
    path: "interface",
  },
  "Address Family": {
    path: "ipprotocol",
  },
  Protocol: {
    path: "protocol",
  },
  "Source Type": {
    path: "source",
    options: ["any", "address", "network"],
  },
  Source: {
    path: "source/dynamic",
  },
  "Source Port": {
    path: "source/port",
  },
  "Destination Type": {
    path: "destination",
    options: ["any", "address", "network"],
  },
  Destination: {
    path: "destination/dynamic",
  },
  "Destination Port": {
    path: "destination/port",
  },
  Description: {
    path: "descr",
  },
  "Associated Rule ID": {
    path: "associated-rule-id",
  },
};

module.exports = ruleMap;
