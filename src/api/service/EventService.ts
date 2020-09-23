const { getCollection } = require('../../lib/dbutils');
import { eventCollection, eventSchema } from '../../modules/event/model';

export let getEvents = async (space: string) => {
  const model = getCollection(space, eventCollection, eventSchema);
  const data = await model.find({}).sort('occurrence');
  return {
    status: 200,
    data,
  };
};

export let saveEvent = async (space: string, payload: any) => {
  const model = getCollection(space, eventCollection, eventSchema);
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
