'use strict';

const fs = require('fs');

function readFile(fileRoute) {

    return new Promise((resolve, reject) => {

        fs.readFile(fileRoute, (err, data) => {
            if (err) {
                reject(err);
            }

            try {
                //Parsear el contenido del json a Objeto
                const response = JSON.parse(data);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = readFile;

