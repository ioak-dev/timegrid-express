import { Request, Response } from 'express';
import { getAllUsersImpl } from '../service/UserService';

export let getAllUsers = async (req: Request, res: Response) => {
  const response = await getAllUsersImpl(req.params.space);
  res.status(response.status).send(response.data);
};
