import { Router } from 'express';
import { readFileSync } from 'fs';

export const router = Router();

router.get('/services', (req, res) => {
  res.json(JSON.parse(getServices()));
});

function getServices() {
  return readFileSync('./server/services.json').toString();
}
