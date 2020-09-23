const { getCollection } = require('../../lib/dbutils');
import { userCollection, userSchema } from '../../modules/user/model';

export let getAllUsersImpl = async (space: string) => {
  const model = getCollection(space, userCollection, userSchema);
  const data = await model.find({});
  return {
    status: 200,
    data,
  };
};
