const sendErrorResponse = (
  res,
  statusCode,
  message,
  code = "ERROR",
  details = null
) => {
  res.status(statusCode).json({
    status: "error",
    statusCode,
    code,
    message,
    details,
  });
};

export default sendErrorResponse;
