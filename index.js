const package = require('./package.json');

const restify = require('restify');
const server = restify.createServer();

const models = require('./models');

// Models
models.init();

// Add basic restify middleware
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Routes
const home = require('./controllers/home');
const employee = require('./controllers/employee');

server.get('/', home.home);

server.get('/employee', employee.getAll);
server.get('/employee/:id', employee.get);
server.post('/employee', employee.create);
server.put('/employee/:id', employee.update);
server.del('/employee/:id', employee.remove);

server.listen(process.env.PORT || 4000, process.env.URL || '127.0.0.1', () => {
  console.log(`${package.name}@${package.version} listening at ${server.url}`);
});