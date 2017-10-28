'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taskCtrlStub = {
  index: 'taskCtrl.index',
  show: 'taskCtrl.show',
  create: 'taskCtrl.create',
  upsert: 'taskCtrl.upsert',
  patch: 'taskCtrl.patch',
  destroy: 'taskCtrl.destroy'
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
var taskIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './task.controller': taskCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Task API Router:', function() {
  it('should return an express router instance', function() {
    taskIndex.should.equal(routerStub);
  });

  describe('GET /api/tasks', function() {
    it('should route to task.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'taskCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/tasks/:id', function() {
    it('should route to task.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'taskCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/tasks', function() {
    it('should route to task.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated','taskCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/tasks/:id', function() {
    it('should route to task.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'taskCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/tasks/:id', function() {
    it('should route to task.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'taskCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/tasks/:id', function() {
    it('should route to task.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'taskCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
