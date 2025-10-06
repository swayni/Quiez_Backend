import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Anket Uygulaması API Dokümantasyonu',
        version: '1.0.0',
        description: 'Anket uygulaması için RESTful API servisleri.',
    },
    servers: [
        {
            url: 'http://localhost:3000/api/',
            description: 'Yerel Geliştirme Sunucusu',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT Tokenı Authorization başlığı ile gönderin (Bearer Token)',
            },
        },
    },
};

const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts/'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;