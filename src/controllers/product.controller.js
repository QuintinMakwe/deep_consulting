const ProductService = require('../services/product.service');

const response = require("./../utils/response");


class ProductController {
    static async addProducts(req, res){
        const result = await ProductService.addProduct(req);

        res.status(200).send(response("Product added successfully", result));

    }

    static async sellProducts(req, res) {
        const result = await ProductService.sellProduct(req);

        res.status(200).send(response("Product sold successfully", result));
    }

    static async getProducts(req, res){
        const result = await ProductService.getProduct(req);

        res.status(200).send(response("Product fetched successfuylly", result));
    }
}


module.exports = ProductController;