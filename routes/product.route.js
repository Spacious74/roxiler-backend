const express = require('express');
const productRouter = express.Router();
const controller = require('../controllers/product.controller')

productRouter.get('/all', controller.getAllTransactions);
productRouter.get('/month', controller.getDataFromMonth);
productRouter.get('/barChart', controller.getBarChartRanges);
productRouter.get('/pieChart', controller.getPieChart);

module.exports = productRouter;
