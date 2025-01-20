function convertToSubcurrency(amount: number, factor = 1) {
  return Math.round(amount * factor);
}

export default convertToSubcurrency;
