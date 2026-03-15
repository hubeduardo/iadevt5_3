import { Router } from 'express';
import { weatherController } from './weather.controller';

const weatherRouter = Router();

weatherRouter.get('/forecast', (req, res) => weatherController.getForecast(req, res));
weatherRouter.get('/geocoding', (req, res) => weatherController.geocodeCity(req, res));

export default weatherRouter;
