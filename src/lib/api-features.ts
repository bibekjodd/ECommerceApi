import type { GetProductsQuery } from '@/controllers/product.controller';
import type { QueryProduct, TProduct } from '@/models/product.model';
import { type FilterQuery } from 'mongoose';
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

  filter() {
    // --------- filter by price ---------
    if (this.query.price_gt) {
      this.result = this.result.find({
        price: { $gt: Number(this.query.price_gt) || 0 }
      });
    } else if (this.query.price_gte) {
      this.result = this.result.find({
        price: { $gte: Number(this.query.price_gte) || 0 }
      });
    } else if (this.query.price_lt) {
      this.result = this.result.find({
        price: { $lt: Number(this.query.price_lt) || 0 }
      });
    } else if (this.query.price_lte) {
      this.result = this.result.find({
        price: { $lte: Number(this.query.price_lte) || 0 }
      });
    }

    // --------- filter by ratings ---------
    if (this.query.ratings_gt) {
      this.result = this.result.find({
        ratings: { $gt: Number(this.query.ratings_gt) || 0 }
      });
    } else if (this.query.ratings_gte) {
      this.result = this.result.find({
        ratings: { $gte: Number(this.query.ratings_gte) || 0 }
      });
    } else if (this.query.ratings_lt) {
      this.result = this.result.find({
        ratings: { $lt: Number(this.query.ratings_lt) || 0 }
      });
    } else if (this.query.ratings_lte) {
      this.result = this.result.find({
        ratings: { $lte: Number(this.query.ratings_lte) || 0 }
      });
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

    if (this.query.orderby === 'price_asc') {
      this.result = this.result.sort({ price: 'asc' });
    } else if (this.query.orderby === 'price_desc') {
      this.result = this.result.sort({ price: 'desc' });
    } else if (this.query.orderby === 'ratings_asc') {
      this.result = this.result.sort({ ratings: 'asc' });
    } else if (this.query.orderby === 'ratings_desc') {
      this.result = this.result.sort({ ratings: 'desc' });
    }
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const pageSize = Number(this.query.page_size) || 20;
    const skip = (page - 1) * pageSize;
    this.result = this.result.skip(skip).limit(pageSize);
    return this;
  }

  async countTotalProducts() {
    return this.result.countDocuments();
  }

  async runAllQueries() {
    this.search().filter().order().paginate();
    return this;
  }
}
