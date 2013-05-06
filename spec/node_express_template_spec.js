require("jasmine-node-exec").exec(__filename);

(function() {
  var fs = require("fs");
  var path = require("path");
  var _ = require("underscore")._;
  var slice = Array.prototype.slice;
  var YAML = require("yaml-node");

  var extendFuncs = function(mod) {
    _.extend(mod, {
      relativePath: mod.path.replace(process.cwd() + "/", ''),
      join: function() {
        return path.join.apply(this, [mod.path].concat(slice.call(arguments)));
      },
      exists: function() {
        return fs.existsSync(mod.path);
      },
      hasFile: function(filePath) {
        var absoluteFilePath = mod.join(filePath);
        return fs.existsSync(absoluteFilePath) && fs.statSync(absoluteFilePath).isFile();
      },
      hasDirectory: function(dirPath) {
        var absoluteFilePath = mod.join(dirPath);
        return fs.existsSync(absoluteFilePath) && fs.statSync(absoluteFilePath).isDirectory();
      }
    });
  };

  var moduleRoot = {
    path: process.cwd()
  };

  extendFuncs(moduleRoot);

  var dummyAppRoot = {
    path: path.join(moduleRoot.join('spec', 'tmp', 'dummy_app')),
    clean: function(next) {
      require("rimraf")(dummyAppRoot.path, next);
    },
    create: function(next) {
      fs.mkdirSync(dummyAppRoot.path, "0755");
    }
  };
  extendFuncs(dummyAppRoot);

  var exec = function(cmd, args, callback) {
    if (typeof args === 'function') {
      callback = args;
      args = [];
    }

    var terminal = require("child_process").spawn("bash");
    terminal.stdout.on("data", function(data) {
      console.log('stdout: %s', data);
    });

    terminal.stderr.on('data', function(data) {
      console.warn("stderr: %s", data);
    });

    terminal.on('exit', callback);

    terminal.stdin.write(cmd + " " + args.join(" "));
    terminal.stdin.end();
  };

  var execute = function(args, callback) {
    exec(moduleRoot.join("bin/express_template"), args, callback);
  };

  beforeEach(function(done) {
    this.addMatchers({
      toHaveDirectory: function(expected) {
        return dummyAppRoot.hasDirectory(expected);
      },
      toHaveFile: function(expected) {
        return dummyAppRoot.hasFile(expected);
      }
    });
    dummyAppRoot.clean(function() {
      expect(dummyAppRoot.exists()).toEqual(false);
      done();
    });
  });

  afterEach(function(done) {
    dummyAppRoot.clean(function() {
      expect(dummyAppRoot.exists()).toEqual(false);
      done();
    });
  });

  describe("bin/express_template", function() {
    it("creates a folder structure", function(done) {
      execute(["spec/tmp/dummy_app"], function() {
        expect(dummyAppRoot.relativePath).toHaveDirectory("routes");
        expect(dummyAppRoot.relativePath).toHaveDirectory("public");
        expect(dummyAppRoot.relativePath).toHaveDirectory("config");
        expect(dummyAppRoot.relativePath).toHaveDirectory("server");
        expect(dummyAppRoot.relativePath).toHaveDirectory("spec");
        done();
      });
    });

    it("builds a database configuration", function(done) {
      execute(["spec/tmp/dummy_app"], function() {
        expect(dummyAppRoot.relativePath).toHaveFile('config/database.yml');
        var config = YAML.read(dummyAppRoot.join("config/database.yml"));
        expect(config.development.database).toEqual("dummy_app_dev");
        expect(config.test.database).toEqual("dummy_app_test");
        done();
      });
    });
  });
}());
