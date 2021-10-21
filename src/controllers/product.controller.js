const ProductService = require('../services/product.service');

const response = require("./../utils/response");


class ProductController {
    static async addProducts(req, res){
        const result = await ProductService.addProduct(req);

        res.status(200).send(response("Product added successfully", result));

    }
}


module.exports = ProductController;