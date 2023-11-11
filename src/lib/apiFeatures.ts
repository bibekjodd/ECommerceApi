import mongoose, { type FilterQuery } from 'mongoose';
import type { QueryProduct, TProduct } from '../models/product.model';
import type { GetProductsQuery } from '../controllers/product.controller';
type ProductFilterQuery = FilterQuery<TProduct>;

export default class ApiFeatures {
  totalProducts = 0;
  constructor(
    public result: QueryProduct,
    public query: GetProductsQuery
  ) {
    this.result = result;
    this.query = query;
  }

  /**
   * find product that matches `title` and `category`
   */
  search() {
    const filterQuery: ProductFilterQuery = {
      title: {
        $regex: this.query.title || '',
        $options: 'i'
      },
      category: this.query.category || undefined,
      brand: this.query.brand || undefined,
      featured:
        this.query.featured === 'true'
          ? true
          : this.query.featured === 'false'
          ? false
          : undefined,
      owner: this.query.owner || undefined
    };

    this.result = this.result.find(JSON.parse(JSON.stringify(filterQuery)));

    return this;
  }

  invalidOwner() {
    return this.query.owner && !mongoose.isValidObjectId(this.query.owner);
  }

  /**
   * filter product by `price` & `rating`
   */
  filter() {
    // --------- filter by price ---------
    if (this.query.price) {
      let queryString = JSON.stringify(this.query.price);
      queryString = queryString.replace('gt', '$gt');
      queryString = queryString.replace('lt', '$lt');

      this.query.price = JSON.parse(queryString);
      for (const key of Object.keys(this.query.price || {})) {
        // @ts-ignore
        this.query.price[key] = Number(this.query.price[key]) || 0;
      }
      this.result = this.result.find({ price: this.query.price });
    }

    // --------- filter by ratings ---------
    if (this.query.ratings) {
      let queryString = JSON.stringify(this.query.ratings);
      queryString = queryString.replace('gt', '$gt');
      queryString = queryString.replace('lt', '$lt');

      this.query.ratings = JSON.parse(queryString);
      for (const key of Object.keys(this.query.ratings || {})) {
        // @ts-ignore
        this.query.ratings[key] = Number(this.query.ratings[key]) || 0;
      }
      this.result = this.result.find({ ratings: this.query.ratings });
    }

    if (this.query.offer === 'hotoffers' || this.query.offer === 'sales') {
      this.result = this.result.find({
        discountRate: {
          $gte: this.query.offer === 'hotoffers' ? 20 : 5,
          $lt: this.query.offer === 'hotoffers' ? 101 : 20
        }
      });
    }

    return this;
  }

  order() {
    if (!this.query.orderby) return this;

    const [property, method] = this.query.orderby.split('-');
    if (!property) return this;
    const validProperties = ['price', 'createdAt', 'ratings'];

    if (validProperties.includes(property)) {
      this.result = this.result.sort({
        [property]: method === 'asc' ? 'asc' : 'desc'
      });
    }

    return this;
  }

  /**
   * paginate the result by `page number` and `page size`
   */
  paginate() {
    const page = Number(this.query.page) || 1;

    const pageSize = Number(this.query.pageSize) || 20;

    const skip = (page - 1) * pageSize;

    this.result = this.result.skip(skip).limit(pageSize).populate('owner');

    return this;
  }

  async countTotalProducts() {
    return this.result.countDocuments();
  }
}
