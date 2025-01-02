import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  date: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {


  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || 'f72e90928fdcfaea0f62fec813cbdeee';
  }

  private buildGeocodeQuery(cityName: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    
    const response = await fetch(this.buildGeocodeQuery(cityName));
    console.log(process.env.API_KEY);
    const data = await response.json();
    
    console.log(data);
    if (!data[0]) throw new Error('City not found');
    
 
    return { lat: data[0].lat, lon: data[0].lon };
  }

  async getWeatherForCity(cityName: string): Promise<Weather[]> {
    
    const coordinates = await this.fetchLocationData(cityName);
    
    const response = await fetch(this.buildWeatherQuery(coordinates));
    
    const data = await response.json();
    
    // Extract the list from the response
    const weatherList = data.list;
    
   
    const dailyForecasts = weatherList.filter((_: any, i: number) => i % 8 === 0).slice(0, 7);
    

    
    // Map the data to our Weather interface format
    return dailyForecasts.map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      tempF: Math.round(item.main.temp),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed),
      description: item.weather[0].description,
      icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
      cityName: cityName
    }));
  }
}


export default new WeatherService();
