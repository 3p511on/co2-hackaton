'use strict';

module.exports = async (req, res) => {
  try {
    const regions = [];
    for await (const key of req.database.scanIterator({ TYPE: 'hash', MATCH: 'region*' })) {
      regions.push(await req.database.hGetAll(key));
    }

    if (regions.length === 0) throw new Error('Список регионов пуст');

    res
      .status(200)
      .send({ success: true, results: regions.map(i => ({ id: +i.id, name: i.name })).sort((a, b) => a.id - b.id) });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err });
    return false;
  }
};
