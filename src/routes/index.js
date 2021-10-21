const router = require("express").Router();
const ProductController = require('../controllers/product.controller');

router.post('/add/:item', ProductController.addProducts);

router.post('/sell/:item');

router.get('/quantity/:item');


module.exports = router