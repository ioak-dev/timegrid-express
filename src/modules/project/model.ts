var mongoose = require('mongoose');

const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const projectCollection = 'project';

// module.exports = mongoose.model('bookmarks', articleSchema);
export { projectSchema, projectCollection };
