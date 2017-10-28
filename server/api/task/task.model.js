'use strict';

import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: String,
  description: String,
  time: [{
    start: Date,
    finish: Date
  }],
  isStared: {type: Boolean, default: false },
  user: [{type: Schema.ObjectId, ref: 'User', required: true}],
  project: {type: Schema.ObjectId, ref: 'Project'},
  active: {type: Boolean, default: true }
});

TaskSchema.plugin(timestamps);
TaskSchema.plugin(deepPopulate);

export default mongoose.model('Task', TaskSchema);
