const normalizeAndSplit = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\.,\?¡!¿]/g, "")
    .split(/\s+/);
};

module.exports = normalizeAndSplit;
