'use strict';

const fs = require('fs');

module.exports = async ({ database }, path = 'dataset.csv') => {
  try {
    if (!fs.existsSync(path)) throw new Error('Датасет не найден');

    const datasetContent = fs.readFileSync(path, 'utf-8');
    const datasetLines = datasetContent.split('\n').map(i => i.split(','));
    const parsedDataset = datasetLines.map(([year, month, region, co2, trees]) => ({
      year: +year,
      month: +month,
      region,
      co2: +co2,
      trees: +trees,
    }));

    // Add data types
    const dataTypes = [
      { name: 'CO2', units: 'tons' },
      { name: 'Trees', units: 'pcs' },
    ];
    for await (const [i, dataType] of Object.entries(dataTypes)) {
      await database.sendCommand(['HSET', `datatype:${i}`, 'id', i, 'name', dataType.name, 'units', dataType.units]);
    }

    // Add regions and years
    const regions = Array.from(new Set(parsedDataset.map(i => i.region)));
    for await (const [i, region] of Object.entries(regions)) {
      await database.sendCommand(['HSET', `region:${i}`, 'id', i, 'name', region]);

      const dataByYears = parsedDataset.filter(j => j.region === region);
      for await (const dataByMonths of dataByYears) {
        for await (const [dataTypeIndex, dataType] of Object.entries(dataTypes)) {
          database.sendCommand([
            'HSET',
            `year:${dataByMonths.year}:region:${i}:dataType:${dataTypeIndex}:month:${dataByMonths.month}`,
            'dateStart',
            `${dataByMonths.year}-${dataByMonths.month.toString().padStart(2, 0)}-01`,
            'region',
            region,
            'value',
            dataByMonths[dataType.name.toLowerCase()].toString(),
            'dataType',
            dataType.name,
          ]);
        }
      }
    }

    database.set('imported', 'true');

    return true;
  } catch (err) {
    // TODO: Add chalk
    console.error(err);
    return false;
  }
};
