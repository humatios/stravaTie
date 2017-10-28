'use strict';

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newTask;

describe('Task API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  var token;

  before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /api/tasks', function() {
    var tasks;

    beforeEach(function(done) {
      request(app)
        .get('/api/tasks')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tasks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      tasks.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/tasks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/tasks')
        .set('authorization', 'Bearer ' + token)
        .send({
          name: 'New Task',
          description: 'This is the brand new task!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTask = res.body;
          done();
        });
    });

    it('should respond with the newly created task', function() {
      newTask.name.should.equal('New Task');
      newTask.description.should.equal('This is the brand new task!!!');
    });
  });

  describe('GET /api/tasks/:id', function() {
    var task;

    beforeEach(function(done) {
      request(app)
        .get(`/api/tasks/${newTask._id}`)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          task = res.body;
          done();
        });
    });

    afterEach(function() {
      task = {};
    });

    it('should respond with the requested task', function() {
      task.name.should.equal('New Task');
      task.description.should.equal('This is the brand new task!!!');
    });
  });

  describe('PATCH /api/tasks/:id', function() {
    var patchedTask;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/tasks/${newTask._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Task' },
          { op: 'replace', path: '/description', value: 'This is the patched task!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTask = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTask = {};
    });

    it('should respond with the patched task', function() {
      patchedTask.name.should.equal('Patched Task');
      patchedTask.description.should.equal('This is the patched task!!!');
    });
  });

  describe('DELETE /api/tasks/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/tasks/${newTask._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when task does not exist', function(done) {
      request(app)
        .delete(`/api/tasks/${newTask._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
