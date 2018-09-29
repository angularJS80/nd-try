

module.exports =  {

        swaggerDefinition: {
            info: {
                description: 'This is a sample server',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: 'localhost:38080',
            basePath: '/',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: ['./routes/*.js'] //Path to the API handle folder

}

var swaggeroption = require('./middleware/swaggeroption')
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(swaggeroption)
