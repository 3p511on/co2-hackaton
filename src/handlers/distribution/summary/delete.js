'use strict';

module.exports = async (req, res) => {
  try {
    // Validate the request
    const { year, region: regionID, dataType: dataTypeID, month } = req.body;
    if (!year || isNaN(+year) || year.toString().length !== 4) {
      res.status(400).send({
        success: false,
        error: 'Необходимо указать параметр "year". Он должен быть числом и состоять из 4 символов',
      });
      return false;
    }

    if (!month || isNaN(+month) || +month > 12 || +month <= 0) {
      res.status(400).send({
        success: false,
        error: 'Необходимо указать параметр "month". Он должен быть числом и не быть больше 12',
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
    const foundedSummary = await req.database.hGetAll(
      `year:${year}:region:${regionID}:dataType:${dataTypeID}:month:${month}`,
    );
    if (!foundedSummary) {
      res.status(404).send({ success: false, error: `Информация по указанному году не найдена` });
      return false;
    }

    await req.database.sendCommand(['HDEL', `year:${year}:region:${regionID}:dataType:${dataTypeID}:month:${month}`]);

    res.status(204);
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message ?? err });
    return false;
  }
};
