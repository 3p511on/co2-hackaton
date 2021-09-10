'use strict';

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await req.database.hGetAll(`region:${id}`);
    if (!region.id) {
      res.status(404).send({ success: false, error: `Регион с ID "${id}" не найден` });
      return false;
    }

    await req.database.sendCommand(['HDEL', `region:${id}`]);
    res.status(204);

    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
