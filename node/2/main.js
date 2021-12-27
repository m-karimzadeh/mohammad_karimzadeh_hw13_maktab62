const fs = require('fs');
const path = require('path');

async function mergeFileData(filePath1, filePath2) {
    let allName = []
        , allNumber = []
        , fileData;

    fileData = await fs.promises.readFile(filePath1, 'utf8');
    for (let record of fileData.split("\r\n")) {
        let recordArray = record.split("-");
        allName.push({ id: recordArray[0], name: recordArray[1] });
    }

    fileData = await fs.promises.readFile(filePath2, 'utf8');
    for (let record of fileData.split("\r\n")) {
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

const filePath1 = path.join(__dirname, "names.txt");
const filePath2 = path.join(__dirname, "numbers.txt");

mergeFileData(filePath1, filePath2)
    .then(() => {
        console.log("all done");

    }).catch(err => {
        console.log(err);
    });