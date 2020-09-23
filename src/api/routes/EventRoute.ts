import express, { Application, Request, Response } from 'express';
import { getEvents, saveEvent } from '../service/EventService';

export class EventRoute {
  public route(app: Application) {
    app.get('/api/event/:space', async (req: Request, res: Response) => {
      const response = await getEvents(req.params.space);
      res.status(response.status).send(response.data);
    });
    app.put('/api/event/:space', async (req: Request, res: Response) => {
      const response = await saveEvent(req.params.space, req.body.payload);
      res.status(response.status).send(response.data);
    });
  }
}
