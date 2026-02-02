export const getErrorMessage = (error, message) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    message ||
    "Something went wrong. Please try again."
  );
};
