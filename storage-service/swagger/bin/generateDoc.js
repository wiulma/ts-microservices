#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const swaggerJSDoc = require('swagger-jsdoc');
const SwaggerParser = require('swagger-parser');
const rootPath = path.resolve(__dirname, '../../');
const definitionPath = path.resolve(rootPath, 'swagger/definitions');
const publicPath = path.resolve(rootPath, 'swagger/public');
// const apiDocFilename = 'apidoc.json';
const config = require(path.resolve(rootPath, 'package.json'));
const swaggerConf = config.swagger;

const routesFileFolder = path.resolve(definitionPath, 'generated');
const routesFilePath = path.resolve(routesFileFolder, 'routes.json');
const publicApiFilePath = path.resolve(publicPath, swaggerConf.descriptionFile);

fsExtra.ensureDirSync(publicPath);

let options = {
    swaggerDefinition: {
    },
    apis: [path.resolve(rootPath, swaggerConf.source)]
};

let swaggerSpec = swaggerJSDoc(options);

const fixAllOf = function(obj) {
    let p = obj.allOf;
    let res = {};
    p.forEach(function(item) {
        res = Object.assign(res, item);
    });
    return res;
};
try {
    const docPath = path.resolve(rootPath, swaggerConf.destination);

    fsExtra.ensureDirSync(docPath);

    fs.existsSync(routesFileFolder) || fs.mkdirSync(routesFileFolder);

    if (fs.existsSync(routesFilePath)) {
        console.info('Remove old definitions...');
        fsExtra.unlinkSync(routesFilePath);
    }

    fs.writeFileSync(routesFilePath, JSON.stringify(swaggerSpec.paths, null, '\t'));
    console.log('Succesfully generated routes include.');
    SwaggerParser.bundle(path.resolve(definitionPath, 'index.yml'), {
        'cache': {
            'fs': false
        }
    })
    .then(function(result) {
        result.definitions = fixAllOf(result.definitions);
        result.parameters = fixAllOf(result.parameters);
        result.responses = fixAllOf(result.responses);
        let str = JSON.stringify(result, null, 2).replace(/(\/allOf\/\d+)/g, '');
        fs.writeFileSync(publicApiFilePath, str);
        console.log('Bundled API %s, Version: %s', result.info.title, result.info.version);
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });
} catch (exc) {
    console.error(exc);
    process.exit(1);
}
