import { Request, Response } from 'express';
import { getSessionImpl } from '../service/AuthService';

export let getSession = async (req: Request, res: Response) => {
  const response = await getSessionImpl(req.params.space, req.params.authKey);
  res.status(response.status).send(response.data);
};
