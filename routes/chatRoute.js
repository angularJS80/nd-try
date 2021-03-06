var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');

// GET ALL CHAT
router.get('/chats', function(req,res){
    Chat.find(function(err, datas){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(datas);
    })
});

// CREATE CHAT
router.post('/chat', function(req, res){
    var chat = new Chat(req.body);
    chat.published_date = new Date(chat.published_date);
    chat.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    });
});

module.exports = router;