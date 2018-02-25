var jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    console.log("verifytoken : "+ req)
    var token = req.body.token || req.query.token || req.headers['authorization'];
    console.log(token);
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, global.config.jwt_secret, function(err, decoded) {
            if (err) { //failed verification.
                return res.json({
                    "error": {
                        status:403,
                        msg:"unverifies token"
                    }
                });
            }
            req.decoded = decoded;
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        return res.status(403).send({
            "error": {
                status:403,
                msg:"forbidden error"
            }
        });
    }
}