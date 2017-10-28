'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var projectCtrlStub = {
  index: 'projectCtrl.index',
  show: 'projectCtrl.show',
  create: 'projectCtrl.create',
  upsert: 'projectCtrl.upsert',
  patch: 'projectCtrl.patch',
  destroy: 'projectCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var projectIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './project.controller': projectCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Project API Router:', function() {
  it('should return an express router instance', function() {
    projectIndex.should.equal(routerStub);
  });

  describe('GET /api/projects', function() {
    it('should route to project.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'projectCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/projects/:id', function() {
    it('should route to project.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'projectCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/projects', function() {
    it('should route to project.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'projectCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/projects/:id', function() {
    it('should route to project.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'projectCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/projects/:id', function() {
    it('should route to project.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'projectCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/projects/:id', function() {
    it('should route to project.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'projectCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
