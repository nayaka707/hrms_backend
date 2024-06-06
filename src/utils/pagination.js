const getPagination = (page, size) => {
  const limit = size ? +size : 50;
  const adjustedPage = page && page >= 1 ? page : 1;
  const offset = adjustedPage ? (adjustedPage - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit, searchingFor) => {
  if (searchingFor === "companies") {
    const { count: totalItems, rows: companies } = data;
    const currentPage = page && page >= 1 ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, companies, totalPages, currentPage };
  } else if (searchingFor === "user") {
    const { count: totalItems, rows: user } = data;
    const currentPage = page && page >= 1 ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, user, totalPages, currentPage };
  } else if (searchingFor === "scannedData") {
    const { count: totalItems, rows: scannedData } = data;
    const currentPage = page && page >= 1 ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, scannedData, totalPages, currentPage };
  } else {
    const { count: totalItems, rows: exhibitions } = data;
    const currentPage = page && page >= 1 ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, exhibitions, totalPages, currentPage };
  }
};

module.exports = { getPagination, getPagingData };
