const csvFilePath = './csv/nodejs-hw1-ex1.csv';
import csv from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';

function converter(filePath: string) {
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream('demo.txt')
    readStream.on('error', (err) => {
        console.log('Error: ' + err)
    })
    writeStream.on('error', (err) => {
        console.log('Error: ' + err)
    })
    readStream.pipe(csv()).pipe(writeStream)
}

converter(csvFilePath)