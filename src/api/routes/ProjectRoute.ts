import express, { Application, Request, Response } from 'express';
import { getProjects, saveProject } from '../service/ProjectService';

export class ProjectRoute {
  public route(app: Application) {
    app.get('/api/project/:space', async (req: Request, res: Response) => {
      const response = await getProjects(req.params.space);
      res.status(response.status).send(response.data);
    });
    app.put('/api/project/:space', async (req: Request, res: Response) => {
      const response = await saveProject(req.params.space, req.body.payload);
      res.status(response.status).send(response.data);
    });
  }
}
