'use strict';

module.exports = async ({ database }) => {
  try {
    const alreadyImported = await database.get('imported');

    if (alreadyImported === 'true') return true;
    return false;
  } catch (err) {
    // TODO: Add chalk
    console.error(err);
  }
  return false;
};
