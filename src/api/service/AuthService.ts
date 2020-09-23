import axios from 'axios';
const { getCollection } = require('../../lib/dbutils');
import { userCollection, userSchema } from '../../modules/user/model';

const ONEAUTH_API = 'http://localhost:8020';

export let getSessionImpl = async (space: string, authKey: string) => {
  try {
    const oaResponse = await axios.get(
      `${ONEAUTH_API}/auth/space/${space}/session/${authKey}`
    );

    if (oaResponse.status === 200) {
      const data = oaResponse.data;
      const model = getCollection(space, userCollection, userSchema);
      const dbResponse = await model.findOneAndUpdate(
        {
          resolver: 'oneauth_space',
          reference: data.userId,
        },
        {
          resolver: 'oneauth_space',
          reference: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        { upsert: true, new: true, rawResult: true }
      );
      return {
        status: 200,
        data: {
          firstName: dbResponse.value.firstName,
          lastName: dbResponse.value.lastName,
          email: dbResponse.value.email,
          token: data.token,
          userId: dbResponse.value._id,
        },
      };
    } else {
      return { status: oaResponse.status, data: oaResponse.data };
    }
  } catch (err) {
    return { status: err.response.status, data: err.response.data };
  }
};
