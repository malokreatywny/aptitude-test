const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    // fetch all employees from database
    const employees = await models.employee.findAll();
    // send the list of employees as response
    res.send(employees);
  } catch (err) {
    // if there's an error, send 500 internal server error response
    res.send(500);
  }

  return next();
};

exports.get = async (req, res, next) => {
  try {
    // fetch employee from database by primary key
    const employee = await models.employee.findByPk(req.params.id);

    // if employee not found, send 404 not found response
    if (!employee) {
      res.send(404);
      return next();
    }

  // send the employee object as response
    res.send(employee); 
  } catch (err) {
    console.error(err);

    // if there's an error, send 500 internal server error response
    res.send(500);
  }

  return next();
};

exports.create = async (req, res, next) => {
  // Check for missing employee information in the request body
  if (!req.body.employee) {
    res.send('Missing `employee` information');
    return next();
  }

  try {
    // Create a new employee using the request body data
    const employee = await models.employee.create(req.body.employee);
    res.send(employee);
  } catch (err) {
    // Handle any validation errors or server errors
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
  // Check for missing employee information in the request body
  if (!req.body.data) {
    res.send('Missing employee data');
    return next();
  }

  try {
    // Find the employee to update by ID
    const employee = await models.employee.findByPk(req.params.id);

    if (!employee) {
      // Return a 404 if the employee was not found
      res.send(404);
      return next();
    }

    // Update the employee data with the request body data
    const updatedEmployee = await employee.update(req.body.data);

    // Send the updated employee data as a response
    res.send(updatedEmployee);
  } catch (err) {
    // Handle any validation errors or other errors
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
    // Delete the employee with the specified ID from the database
    await models.employee.destroy({
      where: {
        id: req.params.id
      }
    });
    // Send a response to the client to indicate successful deletion
    res.send();
  } catch (err) {
    console.error(err);
    // Send a 500 Internal Server Error response to the client
    res.send(500);
  }

  return next();
};