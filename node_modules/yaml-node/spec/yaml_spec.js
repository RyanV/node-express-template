var YAML = require("../index")
  , path = require('path');

describe("YAML.read", function() {
  it("synchronously parses and reads a .yml file", function() {
    var yml = YAML.read(path.join(__dirname, 'spec.yml'));
    expect(yml.foo).toEqual('bar');
    expect(yml.nested.foo).toEqual('bar');
  });
});
