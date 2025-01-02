import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  

  try{
    const { cityName } = req.body;
    //console.log(`the city in is  ${cityName}`);
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData);
    await HistoryService.addCity(cityName);
    res.json(weatherData);

  } catch (error){
    res.status(500).json({ error: 'Failed to fetch weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  console.log('conexion in 2');
  try{
    const cities = await HistoryService.getCities();
    res.json(cities);

  }catch (error){
    res.status(500).json({ error: 'Failed to fetch history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  console.log('conexion in 3');
  try{
    await HistoryService.removeCity(req.params.id);
    res.status(200).send();

  }catch (error){
    res.status(500).json({ error: 'Failed to delete city'});
  }
});

export default router;
