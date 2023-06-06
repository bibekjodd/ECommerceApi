"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeatures {
    constructor(result, query) {
        this.result = result;
        this.query = query;
        this.result = result;
        this.query = query;
    }
    /**
     * find product that matches `title` and `category`
     */
    search() {
        this.result = this.result.find({
            title: {
                $regex: this.query.title || "",
                $options: "i",
            },
        });
        const category = this.query.category;
        if (category) {
            this.result = this.result.find({
                category,
            });
        }
        return this;
    }
    /**
     * Filter product by `price` & `rating`
     */
    filter() {
        // --------- filter by price ---------
        this.query.price = this.query.price || {};
        let queryString = JSON.stringify(this.query.price);
        queryString = queryString.replace("gt", "$gt");
        queryString = queryString.replace("lt", "$lt");
        this.query.price = JSON.parse(queryString);
        for (const key of Object.keys(this.query.price)) {
            // @ts-ignore
            this.query.price[key] = Number(this.query.price[key]) || 0;
        }
        this.result = this.result.find({ price: this.query.price });
        // --------- filter by ratings ---------
        this.query.ratings = this.query.ratings || {};
        queryString = JSON.stringify(this.query.ratings);
        queryString = queryString.replace("gt", "$gt");
        queryString = queryString.replace("lt", "$lt");
        this.query.ratings = JSON.parse(queryString);
        for (const key of Object.keys(this.query.ratings)) {
            // @ts-ignore
            this.query.ratings[key] = Number(this.query.ratings[key]) || 0;
        }
        this.result = this.result.find({ ratings: this.query.ratings });
        return this;
    }
    /**
     * paginate the result by `page number` and `page size`
     */
    paginate() {
        this.query.page = Number(this.query.page) || 1;
        if (this.query.pageSize < 1) {
            this.query.pageSize = 1;
        }
        if (this.query.page < 1) {
            this.query.page = 1;
        }
        this.query.pageSize = Number(this.query.pageSize) || 20;
        const skip = (this.query.page - 1) * this.query.pageSize;
        const limit = this.query.pageSize;
        this.result = this.result.skip(skip).limit(limit);
        return this;
    }
}
exports.default = ApiFeatures;
