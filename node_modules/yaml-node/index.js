var YAML = require('yaml-js'),
  fs = require('fs');

function readFile(filepath) {
  var contents;
  try {
    contents = fs.readFileSync(String(filepath), 'utf8');
    return contents;
  } catch(e) {
    throw 'Unable to read "' + filepath + '" file (Error code: ' + e.code + ').'
  }
}

YAML.read = function(filepath) {
  var src = readFile(filepath);
  var result;
  try {
    result = YAML.load(src);
    return result;
  } catch(e) {
    throw 'Unable to parse "' + filepath + '" file (' + e.problem + ').';
  }
};

module.exports = YAML;
