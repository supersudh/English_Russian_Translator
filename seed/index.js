// Step 1: Write JSON Data to a File Using Streams

const fs = require('fs');
const { Transform, pipeline } = require('stream');

const SEED_PATH = `${__dirname}/../dataset`;
const SEED_JSON_PATH = `${SEED_PATH}/seed_data_400.json`;
const SEED_CSV_PATH = `${SEED_PATH}/../dataset/seed_data_400.csv`;

async function main() {
    // const jsonData = [];
    // for (let i = 0;i < 400;i++) {
    //     jsonData.push({
    //         id: i + 1,
    //         EnglishEquivalent: '',
    //         RussianEnglishEquivalent: '',
    //         RussianEquivalent: ''
    //     });
    // }

    // // Create a writable stream
    // const writeStream = fs.createWriteStream(SEED_JSON_PATH);

    // // Write JSON data to the file
    // writeStream.write(JSON.stringify(jsonData), 'utf8');

    // // Close the stream
    // writeStream.end();

    // // Log when the process finishes
    // writeStream.on('finish', () => {
    //     console.log('Finished writing JSON to file');
    //     process.exit(1);
    // });

    // writeStream.on('error', (error) => {
    //     console.error('Error writing JSON data:', error);
    // });


    // 2. Read JSON Data and Convert It to CSV Using Streams


    // Create a readable stream
    const readStream = fs.createReadStream(SEED_JSON_PATH);

    // Create a writable stream for the CSV file
    const csvWriteStream = fs.createWriteStream(SEED_CSV_PATH);

    // Transformer stream to convert JSON to CSV
    const jsonToCsvTransform = new Transform({
        writableObjectMode: true,
        readableObjectMode: true,

        transform(chunk, encoding, callback) {
            const data = JSON.parse(chunk.toString());
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(row =>
                Object.values(row).join(',')
            ).join('\n');

            const csvData = `${headers}\n${rows}`;
            this.push(csvData);
            callback();
        }
    });

    // Handling the pipeline process
    pipeline(
        readStream,
        jsonToCsvTransform,
        csvWriteStream,
        (error) => {
            if (error) {
                console.error('Pipeline failed:', error);
            } else {
                console.log('Pipeline succeeded, CSV file has been created');
            }
        }
    );
}

main().then(d => {
    console.log('done');
}).catch(e => {
    console.log(e);
});