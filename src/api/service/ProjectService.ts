const { getCollection } = require('../../lib/dbutils');
import { projectCollection, projectSchema } from '../../modules/project/model';

export let getProjects = async (space: string) => {
  const model = getCollection(space, projectCollection, projectSchema);
  const data = await model.find({});
  return {
    status: 200,
    data,
  };
};

export let saveProject = async (space: string, payload: any) => {
  const model = getCollection(space, projectCollection, projectSchema);
  let response;
  if (payload._id) {
    response = await model.findByIdAndUpdate(payload._id, payload, {
      upsert: true,
      new: true,
      rawResult: true,
    });
  } else {
    const data = new model(payload);
    response = await data.save();
  }
  return {
    status: 200,
    data: response.value,
  };
};
