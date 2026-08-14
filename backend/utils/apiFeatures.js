class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Search across specified schema fields using case-insensitive Regex
   * @param {Array<string>} searchFields Array of model fields to search
   */
  search(searchFields = []) {
    if (this.queryString.search && searchFields.length > 0) {
      const keyword = this.queryString.search.trim();
      const regex = new RegExp(keyword, 'i');
      
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: regex },
      }));

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  /**
   * Filter query based on request URL query parameters
   * Excludes control keywords (search, sort, sortBy, sortOrder, page, limit, fields)
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['search', 'sort', 'sortBy', 'sortOrder', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for gte, gt, lte, lt operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Sort query results dynamically
   */
  sort() {
    if (this.queryString.sortBy) {
      const sortBy = this.queryString.sortBy;
      const order = this.queryString.sortOrder === 'asc' ? 1 : -1;
      this.query = this.query.sort({ [sortBy]: order });
    } else if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Paginate query results with page and limit
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
