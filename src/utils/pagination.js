function getPaginationParams(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildPaginationMeta(totalItems, page, limit) {
  return {
    currentPage: page,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
    totalItems,
    limit,
  };
}

module.exports = { getPaginationParams, buildPaginationMeta };
