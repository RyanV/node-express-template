var path = require('path'),
  fs = require('fs'),
  slice = Array.prototype.slice,
  Mustache = require('mustache');

var cwd = process.cwd();
var _argv = require('optimist')
  .usage('Usage: express_template [application_name]')
  .boolean('skip-npm-install')
  .default('skip-npm-install', false)
  .describe('skip-npm-install', 'Set to true to skip npm install');

var argv = _argv.argv;

if (argv.h) {
  console.log(_argv.help());
}

var skipNpmInstall = argv['skip-npm-install'];

var APP_PATH = argv._[0];
var APP_NAME = path.basename(APP_PATH);

var appRoot = {
  path: path.join(cwd, APP_PATH),
  join: function() {
    return path.join.apply(this, [appRoot.path].concat(slice.call(arguments)));
  }
};

if (fs.existsSync(appRoot.path)) {
  throw new Error("Application directory " + APP_PATH + " already exists!");
} else {
  fs.mkdirSync(appRoot.path, "0755");
}

process.chdir(appRoot.path);

fs.mkdirSync('routes');
fs.mkdirSync('public');
fs.mkdirSync('spec');
fs.mkdirSync('config');
fs.mkdirSync('server');

var databaseYaml = fs.readFileSync(path.join(__dirname, "../templates/config/database.yml"), 'utf8');
fs.writeFileSync(appRoot.join('config/database.yml'), Mustache.to_html(databaseYaml, {app_name: APP_NAME}), 'utf8');
process.exit();
//fs.mkdirSync();
//process.chdir
//console.info();
