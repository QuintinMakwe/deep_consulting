const router = require("express").Router();
const ProductController = require('../controllers/product.controller');

router.post('/add/:item', ProductController.addProducts);

router.post('/sell/:item', ProductController.sellProducts);

router.get('/quantity/:item', ProductController.getProducts);


module.exports = router