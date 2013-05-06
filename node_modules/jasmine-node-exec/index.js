module.exports.exec = function(filename) {
  if (process.argv[1] == filename) {
    var path = require("path");
    if (path.basename(filename) == "index.js") {
      require("kexec")("jasmine-node --forceexit " + path.dirname(filename));
    } else {
      require("kexec")("jasmine-node --forceexit " + filename);
    }
  }
};
