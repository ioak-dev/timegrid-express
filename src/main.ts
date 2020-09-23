import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { authorize } from './middlewares';
import { initializeSequences } from './startup';

import * as testController from './api/routes/test';
import * as AuthRoute from './api/routes/AuthRoute';
import * as UserRoute from './api/routes/UserRoute';
import { ProjectRoute } from './api/routes/ProjectRoute';
import { EventRoute } from './api/routes/EventRoute';

// Mongo database configuration
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017';
mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.pluralize(undefined);

// Express server configuration
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apollo GraphQL server configuration
const apolloServer = new ApolloServer({
  modules: [require('./modules/session'), require('./modules/user/index.ts')],
  context: ({ req, res }: any) => {
    const authString = req.headers.authorization || '';
    const authParts = authString.split(' ');
    let token = '';
    let user = null;
    let asset = '';
    if (authParts.length === 2) {
      token = authParts[1];
      asset = authParts[0];
      user = authorize(token);
    }
    return { user, token, asset };
  },
  introspection: true,
  playground: true,
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => apolloServer.stop());
}

// Authorize requests
const openRoutes = ['/api/test'];
const openRoutePrefixes = ['/api/auth'];

app.use(function (req: any, res, next) {
  const decoded = authorize(req.headers.authorization);
  req.body = { auth: 'iop', payload: req.body };

  if (decoded || openRoutes.includes(req.path) || doesMatchPrefix(req.path)) {
    next();
  } else {
    res.status(401).send({
      status: 401,
    });
  }
});

const doesMatchPrefix = (routePath: string) => {
  let outcome = false;
  openRoutePrefixes.forEach((item) => {
    if (routePath.startsWith(item)) {
      outcome = true;
    }
  });
  return outcome;
};

// REST API Routes
app.use('/api/test', testController.users);
app.use('/api/auth/:space/session/:authKey', AuthRoute.getSession);
app.use('/api/user/:space/all', UserRoute.getAllUsers);
// app.use('/api/project/:space', ProjectRoute);
new ProjectRoute().route(app);
new EventRoute().route(app);

// Start server
app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
  console.log('REST API Server on http://localhost:4000/api');
});

// Server startup scripts
initializeSequences();
