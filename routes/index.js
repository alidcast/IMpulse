var express = require('express');
var router = express.Router();
var User = require('../models/User');


router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'IMpulse',
    slogan: 'Saving lives, one IM at a time'
  });
});

module.exports = router;
