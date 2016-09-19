var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'IMpulse',
    slogan: 'Saving lives, one IM at a time'
  });
});

module.exports = router;
