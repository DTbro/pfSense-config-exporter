const natMap = {
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
  Protocol: {
    path: "protocol",
  },
  Target: {
    path: "target",
  },
  "Local Port": {
    path: "local-port",
  },
  Interface: {
    path: "interface",
  },
  Description: {
    path: "descr",
  },
  "Associated Rule ID": {
    path: "associated-rule-id",
  },
};

module.exports = natMap;
