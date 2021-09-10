'use strict';

module.exports = async (req, res) => {
  try {
    const dataTypes = [];
    for await (const key of req.database.scanIterator({ TYPE: 'hash', MATCH: 'datatype*' })) {
      dataTypes.push(await req.database.hGetAll(key));
    }

    if (dataTypes.length === 0) throw new Error('Список типов пуст');

    res.status(200).send({ success: true, results: dataTypes });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
