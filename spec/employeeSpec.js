const request = require('request');
const base = `http://${process.env.URL || '127.0.0.1'}:${process.env.PORT || 4000}`;

describe('Employees', () => {
  let employeeId = 1;
  const employee = {
    firstName: 'Patryk',
    lastName: 'Grabowski'
  };

  describe('POST /employee', () => {
    it('should create a new employee', (done) => {

      request.post(`${base}/employee`, { json: { employee: employee } }, function(error, response, body) {
        expect(response.statusCode).toBe(200);

        employeeId = body.id;
        
        expect(body.firstName).toBe(employee.firstName);
        expect(body.lastName).toBe(employee.lastName);

        return done();
      });
    });
  });

  describe('GET /employee/:id', () => {
    it('should return a specific employee', (done) => {
      request.get(`${base}/employee/1`, function(error, response, body) {
        expect(response.statusCode).toBe(200);

        const data = JSON.parse(body);
        expect(data.firstName).toBe("Cedric");
        expect(data.lastName).toBe("Gaggen");
        
        return done();
      });
    });
  });

  describe('GET /employee', () => {
    it('should return a list of employees', (done) => {
      request.get(`${base}/employee`, function(error, response, body) {
        expect(response.statusCode).toBe(200);

        const data = JSON.parse(body);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0].firstName).toBeDefined();
        expect(data[0].lastName).toBeDefined();
        
        return done();
      });
    });
  });

  describe('PUT /employee/:id', () => {
    it('should update an employee', (done) => {
      const updatedEmployee = {
        firstName: 'New',
        lastName: 'Name'
      };

      request.put(`${base}/employee/2`, { json: { data: updatedEmployee } }, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        expect(body.id).toBeDefined();
        expect(body.firstName).toBe(updatedEmployee.firstName);
        expect(body.lastName).toBe(updatedEmployee.lastName);

        return done();
      });
    });
  });

  describe('DELETE /employee/:id', () => {
    it('should delete an existing employee', (done) => {
      request.del(`${base}/employee/${employeeId}`, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        return done();
      });
    });
  });
});
