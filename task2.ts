const csvFilePath = './csv/nodejs-hw1-ex1.csv';
import csv from 'csvtojson';
import { writeFileSync } from 'fs';

async function converter(filePath: string) {
    try {
        const jsonObj = await csv().fromFile(filePath)
        const fileString = jsonObj.reduce((acc, item) => acc + JSON.stringify(item) + '\n', '')
        writeFileSync('demo.txt', fileString);
    } catch (error) {
        console.log(error)
    }
}

converter(csvFilePath)