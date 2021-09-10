'use strict';

module.exports = async (req, res) => {
  try {
    // Validate the request
    const { year, region: regionID, dataType: dataTypeID } = req.query;
    if (!year || isNaN(+year) || year.length !== 4) {
      res.status(400).send({
        success: false,
        error: 'Необходимо указать параметр "year". Он должен быть числом и состоять из 4 символов',
      });
      return false;
    }

    if (!regionID || isNaN(+regionID)) {
      res.status(400).send({
        success: false,
        error: 'Необходимо указать параметр "region". Он должен числом',
      });
      return false;
    }

    if (!dataTypeID || isNaN(+dataTypeID)) {
      res.status(400).send({
        success: false,
        error: 'Необходимо указать параметр "dataType". Он должен числом',
      });
      return false;
    }

    // Get data about requested dataType
    const dataType = await req.database.hGetAll(`datatype:${dataTypeID}`);
    if (!dataType.id) {
      res.status(404).send({ success: false, error: `Тип данных с ID "${dataTypeID}" не найден` });
      return false;
    }
    dataType.id = +dataType.id;

    // Get data about region
    const region = await req.database.hGetAll(`region:${regionID}`);
    if (!region.id) {
      res.status(404).send({ success: false, error: `Регион с ID "${regionID}" не найден` });
      return false;
    }
    region.id = +region.id;

    // Get summary info about the year in region
    const years = [];
    for await (const key of req.database.scanIterator({
      TYPE: 'hash',
      MATCH: `year:${year}:region:${regionID}:dataType:${dataTypeID}*`,
    })) {
      years.push(await req.database.hGetAll(key));
    }

    if (years.length === 0) {
      res.status(404).send({ success: false, error: `Информация по указанному году не найдена` });
      return false;
    }

    res.status(200).send({
      success: true,
      dataType,
      region,
      results: years
        .map(i => ({ dateStart: i.dateStart, value: +i.value }))
        .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()),
    });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message ?? err });
    return false;
  }
};
