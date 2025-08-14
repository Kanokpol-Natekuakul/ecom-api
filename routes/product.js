const express = require("express");
const router = express.Router();

const { createProduct,read, getProduct, getProductsByCount, deleteProduct, searchProducts,update,images,removeImage } = require('../controllers/product');
const { authCheck, adminCheck } = require('../middlewares/authCheck');


router.post('/product', createProduct);
router.get('/products/:count', getProduct);
router.put('/product/:id', update);
router.get('/product/:id', read);
router.delete('/product/:id', deleteProduct);
router.post('/productby', getProductsByCount);
router.post('/search/filters', searchProducts);
router.post('/images',authCheck, adminCheck,images)
router.post('/removeimages',authCheck, adminCheck,removeImage)


module.exports = router;