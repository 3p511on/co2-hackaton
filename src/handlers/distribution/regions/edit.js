'use strict';

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate body
    if (!name) {
      res.status(400).send({ success: false, error: 'Должно быть указано хотя-бы одно поле' });
      return false;
    }

    if (typeof name !== 'string') {
      res.status(400).send({ success: false, error: 'Указанные данные невалидны' });
      return false;
    }

    const region = await req.database.hGetAll(`regions:${id}`);
    if (!region.id) {
      res.status(404).send({ success: false, error: `Регион с ID "${id}" не найден` });
      return false;
    }

    await req.database.sendCommand(['HSET', `region:${id}`, 'name', name ?? region.name]);

    const newDataType = await req.database.hGetAll(`region:${id}`);
    newDataType.id = +newDataType.id;
    res.status(200).send({ success: true, results: newDataType });

    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
