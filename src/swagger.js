"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts/'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
