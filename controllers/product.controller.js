const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const Product = require("../models/Product");

const getAllTransactions = async (req, res) => {
  const searchText = req.query.searchText;
  const requestedMonth = parseInt(req.query.month, 10);

  try {
    let query = {};
    // search query for user search
    if (requestedMonth) {
      query.$expr = {
        $eq: [{ $month: { $toDate: "$dateOfSale" } }, requestedMonth],
      };
    }

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
        { category: { $regex: searchText, $options: "i" } },
      ];
    }
    const data = await Product.find(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};

const getDataFromMonth = async (req, res) => {
  const requestedMonth = parseInt(req.query.month, 10);
  try {
    let query = {};
    // search query for user search
    if (requestedMonth) {
      query.$expr = {
        $eq: [{ $month: { $toDate: "$dateOfSale" } }, requestedMonth],
      };
    }

    // fetching all entries of selected month if get
    const data = await Product.find(query);

    // - Total sale amount of selected month
    const totalSale = data.reduce((acc, doc) => {
      return acc + doc.price;
    }, 0);

    // - Total number of sold items of selected month
    const soldItems = data.filter((product) => product.sold === true);

    // - Total number of not sold items of selected month
    const unSoldItems = data.filter((product) => product.sold === false);

    // console.log(`Total sale : ${totalSale}\nSold items : ${soldItems.length}\nUnsold items : ${unSoldItems.length}`);
    res.status(200).send({
      totalSale,
      soldItems: soldItems.length,
      unSoldItems: unSoldItems.length,
    });
  } catch (error) {
    res.status(404).send({
      Error: error.message,
    });
  }
};

const getBarChartRanges = async (req, res) => {
  const requestedMonth = parseInt(req.query.month, 10);

  try {
    let query = [];
    if (requestedMonth) {
      query.unshift(
        {
          $addFields: {
            month: { $month: { $toDate: "$dateOfSale" } },
          },
        },
        {
          $match: {
            month: requestedMonth,
          },
        }
      );
    }
    query.push(
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          priceRange: "$_id",
          count: 1,
        },
      }
    );

    const data = await Product.aggregate(query);

    res.status(200).send(data);
  } catch (error) {
    res.status(404).send({
      Error: error.message,
    });
  }
};

const getPieChart = async (req, res) => {
  const requestedMonth = parseInt(req.query.month, 10);

  try {
    let query = [];

    if(requestedMonth){
      query.unshift({
        $addFields: {
          month: { $month: { $toDate: "$dateOfSale" } },
        },
      },
      {
        $match: {
          month: requestedMonth,
        },
      },)
    }

    query.push({
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },)

    const data = await Product.aggregate(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send({
      Error: error.message,
    });
  }
};

module.exports = {
  getAllTransactions,
  getDataFromMonth,
  getBarChartRanges,
  getPieChart,
};
