const fs = require('fs');
const path = require('path');

let promiseFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.access(filePath, (err) => {
            if (err) {
                reject(err)

            } else {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })

            }
        })
    });
};

const fileAddress1 = path.join(__dirname, "names.txt");
const fileAddress2 = path.join(__dirname, "numbers.txt");

Promise.all([
    promiseFile(fileAddress1),
    promiseFile(fileAddress2)
])
    .then(([data1, data2]) => {
        mapFileData(data1, data2)
    })
    .catch((err) => console.log("err"));

function mapFileData(nameData, numberData) {
    let allName = []
        , allNumber = [];

    for (let record of nameData.split("\r\n")) {
        let recordArray = record.split("-");
        allName.push({ id: recordArray[0], name: recordArray[1] });
    }

    for (let record of numberData.split("\r\n")) {
        let recordArray = record.split("-");
        allNumber.push({ id: recordArray[0], number: recordArray[1] });
    }

    let joinAllData = [];
    for (const personDataItem of allName) {
        for (const numberItem of allNumber) {
            if (personDataItem.id === numberItem.id) {
                joinAllData.push({ ...personDataItem, ...numberItem });
            }
        }
    }

    for (person of allName) {
        let thisText = ''
            , multiFlag = false;

        for (var i = 0; i < joinAllData.length; i++) {
            if (joinAllData[i].id === person.id) {
                if (thisText !== '') {
                    thisText += ', '
                    multiFlag = true
                }
                thisText += joinAllData[i].number
            }
        }

        if (thisText !== '') {
            console.log(`${person.name}'s phone number${(multiFlag) ? 's are' : ' is'} ${thisText}`);

        } else {
            console.log(`${person.name} hasn't any phone number`);
        }
    }
}