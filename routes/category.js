const express = require('express');
const router = express.Router();
const { createCategory , getCategory , deleteCategory } = require('../controllers/category');
const {authCheck,adminCheck} = require("../middlewares/authCheck")



router.post('/category',authCheck,adminCheck, createCategory);
router.get('/category',getCategory)
router.delete('/category/:id',authCheck,adminCheck,deleteCategory)


module.exports = router;