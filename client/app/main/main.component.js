import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  socket;

  /*@ngInject*/
  constructor($http, $scope, $state, socket) {
    this.$http = $http;
    this.socket = socket;
    this.$state = $state;
    this.newTask = {};
    this.newProject = {};
    this.tasks = [];
    this.projects = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('task');
    });
  }

  $onInit() {
    this.getTask();
    this.getProjects();
  }

  addStrava(){
    this.isHidden = false;
    let self = this;
    this.$http.get('/api/projects/me')
      .then(response => {
        self.isHidden = true;
        self.stravaMe = response.data;
      });
    this.$http.get('/api/projects/route')
      .then(response => {
        console.log(response)
        self.stravaRoute = response.data[0];
      });
  }

  getTask(){
    this.$http.get('/api/tasks')
      .then(response => {
        let data = response.data;
        console.log(data);
        data.forEach((task) => {
          task.time.forEach((time) => {
            const start = time.start;
            const last = time.finish;
            time.total = this.timeBetweenDate(last, start);
          });
        });
        this.tasks = data;
        this.socket.syncUpdates('task', this.tasks);
      });
  }

  getProjects(){
    this.$http.get('/api/projects')
      .then(response => {
        let data = response.data;
        console.log(data);
        this.projects = data;
        this.socket.syncUpdates('projects', this.projects);
      });
  }

  addProject() {
    if(this.newProject) {
      this.$http.post('/api/projects', this.newProject)
        .then((response) => this.$state.reload());
      this.newProject = {};
    }
  }

  timeBetweenDate(now, then){
    return moment
      .utc(moment(now)
      .diff(moment(then)))
      .format("HH:mm:ss")
  }

  startTask(isStart) {
    if(this.newTask) {
      this.newTask.isStart = isStart;
      this.$http.post('/api/tasks', this.newTask)
        .then((response) => this.$state.reload());
      this.newTask = {};
    }
  }

  startTime(id) {
    this.$http.get('/api/tasks/start/' + id)
      .then((response) => this.$state.reload());
  }

  stopTime(id) {
    this.$http.get('/api/tasks/stop/' + id)
      .then((response) => this.$state.reload());
  }

}

export default angular.module('trackingApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
