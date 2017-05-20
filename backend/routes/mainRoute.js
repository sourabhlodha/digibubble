var express = require('express');
var router = express.Router();

var api= require('../lib/mainAPI');

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.get('/startGame', function (req, res) {
    console.log('startgame route');
    res.send(api.startGame());
});

router.post('/submit', function (req, res) {
    var body= api.submit(req.body);
    res.send(body);
});

module.exports = router;
