export class APIFEATURES {
  constructor(queryString, query) {
    this.queryStr = queryString;
    this.query = query;
  }
  // filter
  filter() {
    // private fields
    const privateFields = ['fields', 'sort', 'page', 'limit'];
    // clone of query string
    const queryObjCopy = { ...this.queryStr };
    // start of filter
    privateFields.forEach((el) => delete queryObjCopy[el]);

    const queryString = JSON.stringify(queryObjCopy);
    const filterObjString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matched) => `$${matched}`
    );
    const filterObj = JSON.parse(filterObjString);

    this.query = this.query.find(filterObj);
    return this;
  }
  // select fields
  selectFields() {
    if (this.queryStr.fields) {
      const selectedFields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  // sort fields
  sortFields() {
    if (this.queryStr.sort) {
      const sortFields = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortFields);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  // pagination
  paginate() {
    const page = this.queryStr.page || 1;
    const skip = (page - 1) * this.queryStr.limit;
    this.query = this.query.skip(skip).limit(this.queryStr.limit);
    return this;
  }
}
