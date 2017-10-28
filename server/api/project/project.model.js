'use strict';

import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  tag: [String],
  user: [{type: Schema.ObjectId, ref: 'User'}],
  active: {type: Boolean, default: true }
});

ProjectSchema.plugin(timestamps);
ProjectSchema.plugin(deepPopulate);

export default mongoose.model('Project', ProjectSchema);
