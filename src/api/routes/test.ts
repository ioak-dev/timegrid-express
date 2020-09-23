import { Request, Response } from 'express';

export let users = (req: Request, res: Response) => {
  console.log(req.body);
  let users = [
    {
      test: '890',
    },
  ];

  res.json(users);
};
