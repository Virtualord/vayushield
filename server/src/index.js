import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDirectory = path.resolve(currentDirectory, '../../client/dist');

app.use(cors());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildDirectory));
  app.use((_request, response) => {
    response.sendFile(path.join(clientBuildDirectory, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`VayuShield server listening on port ${port}`);
});
