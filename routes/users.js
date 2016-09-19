var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



// router.get('/addUser', function(req, res, next) {
// 	var user = new User();
// 	user.save(function(err, writeResult) {
// 		if (err) {
// 			console.log(err);
// 			console.log('Unable to add user');
// 			res.send(err);
// 		}
// 		else {
// 			console.log(writeResult);
// 			res.send(writeResult);
// 		}
// 	});
// });
//
// router.get('/addContact', function(req, res, next) {
//     req.send('add contact');
// });


module.exports = router;
