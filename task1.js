'use strict';
const fs = require('node:fs');

const getData = (path) => {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (error) {
    console.log("Can't read file: " + path);
  }
  return null;
};

const parseFile = (data) => {
  const lines = data.split('\n');
  lines.shift();
  const cities = [];
  for (const line of lines) {
    if (line) {
      const cells = line.split(',');
      const [name, population, area, density, country] = cells;
      cities.push({
        name,
        population: parseInt(population),
        area: parseInt(area),
        density: parseInt(density),
        country,
      });
    }
  }
  return cities;
};

const calculateDensityPercentColumn = (cities) => {
  cities.sort((city1, city2) => city2.density - city1.density);
  const maxDensity = cities[0].density;
  for (const city of cities) {
    city.percent = Math.round((city.density * 100) / maxDensity);
  }
};

const showTable = (cities) => {
  for (const city of cities) {
    const line =
      city.name.padEnd(18) +
      city.population.toString().padStart(10) +
      city.area.toString().padStart(8) +
      city.density.toString().padStart(8) +
      city.country.padStart(18) +
      city.percent.toString().padStart(6);
    console.log(line);
  }
};

const data = getData('./cities.csv');
if (data) {
  const cities = parseFile(data);
  calculateDensityPercentColumn(cities);
  showTable(cities);
}
