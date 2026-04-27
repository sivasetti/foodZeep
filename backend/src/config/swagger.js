const swaggerDoc = require('swagger-jsdoc');

const options = {
    definition :{
        openapi : '3.0.0',
        info : {
            title : 'Foodzeep Api',
            version : '1.0.0',
            description : 'Production grade FoodZeep Backend API Documentation'
        },
        servers:[
            {
                url : 'http://localhost:5000'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                   type: 'http',
                   scheme: 'bearer',
                   bearerFormat: 'JWT'
                    }
                }
            }
    },
    apis : [
        './src/modules/**/*.js'
    ]
};

const swaggerSpec = swaggerDoc(options);

module.exports = swaggerSpec;