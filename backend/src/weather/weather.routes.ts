import { Router } from 'express';
import { WeatherController } from './weather.controller';
import { OpenMeteoWeatherService } from './weather.service';

const router = Router();

const weatherService = new OpenMeteoWeatherService();
const weatherController = new WeatherController(weatherService);

router.get('/forecast', weatherController.getForecast);
router.get('/geocoding', weatherController.getGeocoding);

export default router;

