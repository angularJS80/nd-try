var express = require('express');
var router = express.Router();



var heros=[
    { id: 11, name: 'Mr. Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
];


// GET ALL BOOKS
router.get('/getList', function(req,res){
    res.json(heros);
});

router.post('/addHero', function(req,res){
    var myobj = req.body;
    
    
    console.log(req.body)
    res.json(req.body);
});



module.exports = router;