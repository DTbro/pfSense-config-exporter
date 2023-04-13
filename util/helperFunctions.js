const fs = require("fs");
const path = require("path");
const convert = require("xml-js");
const papaparse = require("papaparse");

const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const convert2JSON = (input) => {
  const xml = fs.readFileSync(input);
  const jsonString = convert.xml2json(xml, {
    compact: true,
    spaces: 2,
    ignoreDeclaration: true,
  });
  return JSON.parse(jsonString);
};

const returnValue = (property) => {
  if (Object.values(property).length === 1) {
    return Object.values(property)[0];
  } else {
    return "-";
  }
};

const selectOption = (keys, options) => {
  return keys.filter((key) => options.includes(key)).pop();
};

const resetDirectories = (outputRoot) => {
  const dir = fs.readdirSync(outputRoot);

  dir.forEach((item) => {
    deleteFolderRecursive(path.join(__dirname, "..", outputRoot, item));
  });

  fs.mkdirSync(path.join(__dirname, "..", outputRoot, "aliases"));
  fs.mkdirSync(path.join(__dirname, "..", outputRoot, "fw"));
  fs.mkdirSync(path.join(__dirname, "..", outputRoot, "nat"));

  console.log(`Könyvtárak visszaállitva alaphelyzetbe!`);
};

const makeFile = (data, output) => {
  return new Promise((resolve) => {
    const csv = papaparse.unparse(data, {
      delimiter: ";",
      header: true,
    });

    fs.writeFile(output, csv, (err) => {
      if (err) throw err;
      resolve();
    });
  });
};

module.exports = {
  convert2JSON,
  selectOption,
  returnValue,
  resetDirectories,
  makeFile,
};
