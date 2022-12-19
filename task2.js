const csvFilePath = './csv/nodejs-hw1-ex1.csv';
import csv from 'csvtojson';
import { writeFileSync } from 'fs';

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        const fileString = jsonObj.reduce((acc, item) => {
            console.log(item)
            return acc + JSON.stringify(item) +'\n'
        }, '')
        writeFileSync('demo.txt', fileString);
    })
    .catch((error) => {
        console.log(error)
    })