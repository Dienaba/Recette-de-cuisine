var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Des'Idées", foodRecipes : {recipes: []} });

});

router.post('/', function(req, res, next) {
  request('http://food2fork.com/api/search?key=f48cc78e3a40ae7e2cae2e919ed329f8&q=' + req.body.recherche,
    function (error, response, body) {
    var recipes = JSON.parse(body).recipes;
      res.render('index', { title: "Des'Idées", foodRecipes: recipes });
  });
});


module.exports = router;
