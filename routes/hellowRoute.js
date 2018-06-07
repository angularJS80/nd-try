var express = require('express');
var router = express.Router();

var hellows=[]
hellows.push({"hellow_id":"japen","hellow":"こんにちは"})
hellows.push({"hellow_id":"korea","hellow":"안녕하세요."})


// GET ALL BOOKS
router.get('/hellows', function(req,res){
    res.json(hellows);
});

router.poer

// GET SINGLE BOOK
router.get('/hellow/:hellow_id', function(req, res){
console.log(req.params.hellow_id)

    var rtn =  hellows.filter(function (item) {
        return item.hellow_id == req.params.hellow_id
    })

    res.json(rtn);
});

module.exports = router;