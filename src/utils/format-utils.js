import moment from "moment";

moment();

export const desnormalizeString = (str) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word, index) => {
      if (
        index > 0 &&
        ["da", "de", "do", "das", "dos"].includes(word.toLowerCase())
      ) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .trim();
};

export const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
             .trim()
             .replace(/\s+/g, ' ')
             .toLowerCase();
};