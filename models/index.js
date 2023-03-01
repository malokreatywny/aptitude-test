const fs = require('fs');
const {promisify} = require('util');
const Sequelize = require('sequelize');

const readdir = promisify(fs.readdir);

const models = {};
const seedData = require('./seedData');

async function authenticate (sequelize) {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to SQLite DB');
  } catch (err) {
    console.error('Unable to connect to SQLite DB', err);
    process.exit(1);
  }
}

async function loadModels (sequelize) {
  try {
    const files = await readdir(__dirname);
    
    for (const filename of files) {
      const [model, extension] = filename.split('.');

      if (model !== 'index' && extension === 'js') {
        //models[model] = exports[model] = sequelize.import(`${__dirname}/${model}`);
        models[model] = exports[model] = require(`${__dirname}/${model}`)(sequelize, Sequelize.DataTypes);
      }
    }
    console.log('Successfully loaded Sequelize models');
  } catch (err) {
    console.error('Unable to load Sequelize models', err);
    process.exit(1);
  }
}

async function synchronize (sequelize) {
  try {
    await sequelize.sync({ force: true });
    console.log('DB successfully synchronized');
  } catch (err) {
    console.error('Unable to synchronize DB', err);
    process.exit(1);
  }
}

async function seed () {
  try {
    console.log(Object.keys(models))
    for (const model in seedData) {
      await models[model].bulkCreate(seedData[model]);
    }
    console.log('Successfully seeded data');
  } catch (err) {
    console.error('Error seeding data', err);
    process.exit(1);
  }
}

exports.init = async () => {
  const sequelize = new Sequelize('unochaDb', null, null, {
    dialect: "sqlite",
    storage: './unocha.sqlite',
  });

  await authenticate(sequelize);
  await loadModels(sequelize);
  await synchronize(sequelize);
  await seed();
};
