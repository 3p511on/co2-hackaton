'use strict';

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const dataType = await req.database.hGetAll(`datatype:${id}`);
    if (!dataType.id) {
      res.status(404).send({ success: false, error: `Тип данных с ID "${id}" не найден` });
      return false;
    }

    await req.database.sendCommand(['HDEL', `datatype:${id}`]);
    res.status(204);

    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
