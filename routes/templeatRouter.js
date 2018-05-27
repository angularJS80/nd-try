var express = require('express');
var router = express.Router();
var Template = require('../models/template');


router.get('/template/all', (req, res) => {
    Template.queryAll(req.user, (err, templates) => {
        if (err)	handleError(err);
        return res.status(200).json({ status: 'OK', templates: templates });
    });
});
router.patch('/template/update', (req, res) => {
    Template.update(req.user, req.body.template, (err) => {
        if (err)	handleError(err);
        return res.status(200).json({ status: 'OK' });
    });
});
router.delete('/template/delete', (req, res) => {
    Template.delete(req.user, req.body.templateID, (err) => {
        if (err)	handleError(err);
        return res.status(200).json({ status: 'OK' });
    });
});



router.put('/test/template/new', (req, res) => {

    const template = new Template({
        templateName: req.body.templateName,
        username: req.body.username
    });

    template.save(function(err){
        if(err){
            console.error(err);
            res.json({ status: 'FAIL' });
            return;
        }
        res.json({ status: 'OK' });

    });

});
router.get('/test/template/all', (req, res) => {
    Template.find(function(err, templates){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(templates);
    })
});
router.patch('/test/template/update', (req, res) => {

    Template.update({ _id: req.body.template.templateName }, { $set: req.body.template }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'template not found' });
        res.json( { status: 'OK' });
    })


});
router.delete('/test/template/delete', (req, res) => {
    Template.remove({ _id: req.body.template.templateName }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
         if(!output.result.n) return res.status(404).json({ error: "book not found" });
         res.json({ message: "book deleted" });
         */

        res.status(204).end();
    })


});


module.exports = router;