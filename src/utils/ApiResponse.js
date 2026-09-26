class ApiResponse {
  constructor(statusCode, message = "Success", data = null, pagination = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination !== null) this.pagination = pagination;
  }

  send(res, statusCode = 200) {
    return res.status(statusCode).json(this);
  }
}

module.exports = ApiResponse;
