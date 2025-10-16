// src/utils/customSort.js
const customEventSort = (a, b) => {
  const dateA = new Date(a.datetime);
  const dateB = new Date(b.datetime);
  if (dateA.getTime() !== dateB.getTime()) {
    return dateA - dateB;
  }
  return a.location.localeCompare(b.location);
};

module.exports = customEventSort;