'use strict';

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newProject;

describe('Project API:', function() {

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

  describe('GET /api/projects/me', function() {
    var projects;

    beforeEach(function(done) {
      request(app)
        .get('/api/projects/me')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          debugger
          if(err) {
            return done(err);
          }
          projects = res.body;
          done();
        });
    });
  });

  describe('GET /api/projects', function() {
    var projects;

    beforeEach(function(done) {
      request(app)
        .get('/api/projects')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          projects = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      projects.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/projects', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/projects')
        .set('authorization', 'Bearer ' + token)
        .send({
          name: 'New Project'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProject = res.body;
          done();
        });
    });

    it('should respond with the newly created project', function() {
      newProject.name.should.equal('New Project');
    });
  });

  describe('GET /api/projects/:id', function() {
    var project;

    beforeEach(function(done) {
      request(app)
        .get(`/api/projects/${newProject._id}`)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          project = res.body;
          done();
        });
    });

    afterEach(function() {
      project = {};
    });

    it('should respond with the requested project', function() {
      project.name.should.equal('New Project');
    });
  });

  describe('PATCH /api/projects/:id', function() {
    var patchedProject;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/projects/${newProject._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Project' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProject = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProject = {};
    });

    it('should respond with the patched project', function() {
      patchedProject.name.should.equal('Patched Project');
    });
  });

  describe('DELETE /api/projects/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/projects/${newProject._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when project does not exist', function(done) {
      request(app)
        .delete(`/api/projects/${newProject._id}`)
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
