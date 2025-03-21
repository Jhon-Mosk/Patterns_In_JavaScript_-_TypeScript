'use strict';

const fs = require('node:fs');

class City {
  constructor(name, population, area, density, country) {
    this.name = name;
    this.population = population;
    this.area = area;
    this.density = density;
    this.country = country;
    this.percent = 0; // Изначально процент плотности равен 0
  }

  calculatePercent(maxDensity) {
    this.percent = Math.round((this.density * 100) / maxDensity);
  }
}

class CityData {
  constructor(path) {
    this.path = path;
    this.cities = [];
  }

  getData() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return data;
    } catch (error) {
      console.log("Can't read file: " + this.path);
      return null;
    }
  }

  parseFile(data) {
    const lines = data.split('\n');
    lines.shift(); // Удаляем заголовок
    for (const line of lines) {
      if (line) {
        const cells = line.split(',');
        const [name, population, area, density, country] = cells;
        this.cities.push(
          new City(
            name,
            parseInt(population),
            parseInt(area),
            parseInt(density),
            country,
          ),
        );
      }
    }
  }

  calculateDensityPercentColumn() {
    this.cities.sort((city1, city2) => city2.density - city1.density);
    const maxDensity = this.cities[0].density;
    for (const city of this.cities) {
      city.calculatePercent(maxDensity);
    }
  }
}

class Table {
  constructor(cities) {
    this.cities = cities;
  }

  formatCity(city) {
    return (
      city.name.padEnd(18) +
      city.population.toString().padStart(10) +
      city.area.toString().padStart(8) +
      city.density.toString().padStart(8) +
      city.country.padStart(18) +
      city.percent.toString().padStart(6)
    );
  }

  show() {
    for (const city of this.cities) {
      console.log(this.formatCity(city));
    }
  }
}

const cityData = new CityData('./cities.csv');
const data = cityData.getData();
if (data) {
  cityData.parseFile(data);
  cityData.calculateDensityPercentColumn();

  const table = new Table(cityData.cities);
  table.show();
}
