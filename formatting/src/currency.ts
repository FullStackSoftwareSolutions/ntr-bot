const currenyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

export const formatCurrency = (amount: number) => {
  return currenyFormatter.format(amount);
};

export const parseCurrency = (amount: string) => {
  return Number(amount.replace(/[^0-9.-]+/g, ""));
};
