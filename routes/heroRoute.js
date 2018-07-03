var express = require('express');
var router = express.Router();
var HeroSchema = require('../models/heroSchema');



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
    
    HeroSchema.find(function (err,data) {
        console.log(data);
        res.json(data);
    });
    //res.json(heros);
});

router.post('/addHero', function(req,res){
    var hero = req.body;
    var heroSchema = new HeroSchema(hero);
    //heroSchema.id = hero.id;
    //heroSchema.name = hero.name;
    console.log(hero);

    heroSchema.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    });

});

router.get('/removeHero/:_id', function(req, res){
    console.log(req.params);
    HeroSchema.remove({ _id: req.params._id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
    })
});




module.exports = router;