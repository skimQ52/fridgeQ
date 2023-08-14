const express = require("express");
const foodModel = require("../models");
// const app = express();
var router = express.Router();

// router.get("/add_food", function(req, res, next) {
//         res.send("API is working properly");
//     });

router.post("/add_food", async (request, response) => {
    const food = new foodModel(request.body);
  
    try {
      await food.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/foods", async (request, response) => {
    const foods = await foodModel.find({});
  
    try {
      response.send(foods);
    } catch (error) {
      response.status(500).send(error);
    }
});

module.exports = router;

// var express = require("express");
// var router = express.Router();
// var MongoClient = require('mongodb').MongoClient;
// // Replace the uri string with your MongoDB deployment's connection string.
// const uri = "mongodb+srv://skimq52:p8wXdkKXlnTAAZlt@fridgeq.dqervdj.mongodb.net/?retryWrites=true&w=majority";
// var food_name = "NA";
// router.get("/", function(req, res, next) {
//     MongoClient.connect(uri, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("test");
//         dbo.collection("foods").findOne({}, function(err, result) {
//           if (err) throw err;
//           console.log(result.name);
//           food_name = result.name;
//           db.close();
//         });
//     });
//     res.send(food_name);
// });

// module.exports = router;