'use strict';

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, units } = req.body;

    // Validate body
    if (!name && units) {
      res.status(400).send({ success: false, error: 'Должно быть указано хотя-бы одно поле' });
      return false;
    }

    if (typeof name !== 'string' || typeof units !== 'string') {
      res.status(400).send({ success: false, error: 'Указанные данные невалидны' });
      return false;
    }

    const dataType = await req.database.hGetAll(`datatype:${id}`);
    if (!dataType.id) {
      res.status(404).send({ success: false, error: `Тип данных с ID "${id}" не найден` });
      return false;
    }

    await req.database.sendCommand([
      'HSET',
      `datatype:${id}`,
      'name',
      name ?? dataType.name,
      'units',
      units ?? dataType.units,
    ]);

    const newDataType = await req.database.hGetAll(`datatype:${id}`);
    newDataType.id = +newDataType.id;
    res.status(200).send({ success: true, results: newDataType });

    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
