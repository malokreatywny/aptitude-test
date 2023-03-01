const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const employees = await models.employee.findAll();
    res.send(employees);
  } catch (err) {
    res.send(500);
  }

  return next();
};

exports.get = async (req, res, next) => {
  try {
    const employee = await models.employee.findByPk(req.params.id);

    if (!employee) {
      res.send(404);
      return next();
    }

    res.send(employee);
  } catch (err) {
    console.error(err);
    res.send(500);
  }

  return next();
};

exports.create = async (req, res, next) => {
  if (!req.body.employee) {
    res.send('Missing `employee` information');
    return next();
  }

  try {
    const employee = await models.employee.create(req.body.employee);
    res.send(employee);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.send(400, err.toString());
    } else {
      console.error(err);
      res.send(500);
    }
  }
  
  return next();
};

exports.update = async (req, res, next) => {
  if (!req.body.data) {
    res.send('Missing employee data');
    return next();
  }

  try {
    const employee = await models.employee.findByPk(req.params.id);

    if (!employee) {
      res.send(404);
      return next();
    }

    const updatedEmployee = await employee.update(req.body.data);

    res.send(updatedEmployee);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.send(400, err.toString());
    } else {
      console.error(err);
      res.send(500);
    }
  }
  
  return next();
};

exports.remove = async (req, res, next) => {
  try {
    await models.employee.destroy({
      where: {
        id: req.params.id
      }
    });
    res.send();
  } catch (err) {
    console.error(err);
    res.send(500);
  }

  return next();
};