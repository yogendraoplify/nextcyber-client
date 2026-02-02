

const currencyFormatter = (amount, currency = "USD") => {
  const absAmount = Math.abs(amount);

  let value = amount;
  let suffix = "";

  if (absAmount >= 1_000_000_000) {
    value = amount / 1_000_000_000;
    suffix = "B";
  } else if (absAmount >= 1_000_000) {
    value = amount / 1_000_000;
    suffix = "M";
  } else if (absAmount >= 1_000) {
    value = amount / 1_000;
    suffix = "K";
  }

  return (
    new Intl.NumberFormat("en-US", {
      currency,
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value) + suffix
  );
};


const timeFormatter = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export { currencyFormatter, timeFormatter };