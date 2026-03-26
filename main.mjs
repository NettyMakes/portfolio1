// Portfolio assignment Jonas | Netty
import fs from "node:fs"
import { stringify } from "node:querystring";
const cachePath = "cache";

// #region Variables ---------------------------------------------------

const baseURL = "https://alchemy-kd0l.onrender.com";
const regURL = `${baseURL}/start`;
const statusURL = `${baseURL}/status`;
const answerURL = `${baseURL}/submit`;
  
let token = "";
  
const credentials = {
        "email": "jonasah@uia.no",
        "nick": "Netty",
        "pin": "0120"
};
const requestHeaders = () => {
    return { 
        "Content-Type": "application/json",
        "Authorization": token,
    }
} 


const colors = {
    red: "\u001b[31m",
    yellow: "\u001b[33m",
    green: "\u001b[32m",
    cyan: "\u001b[36m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",

    white: "\u001b[37m",
    reset: "\u001b[0m",

};

// #endregion ---------------------------------------------------------------

// #region Cache -------------------------------------------------------

function getCache(){
    let currentCache = [];
    let files = fs.readdirSync(`${cachePath}`);
    for (let file of files) {
        let fileId = file.replace(".json", "");
        let content = JSON.parse(fs.readFileSync(`./${cachePath}/${file}`, "utf8"));
        currentCache[fileId] = content;
    }
    return currentCache;
}

async function addCache(id, data){
    try {
        fs.writeFileSync(`./${cachePath}/${id}.json`, JSON.stringify(data));
    } catch (error) {
        console.error('Error updating cache:', error);
    }
}

// #endregion -------------------------------------------------------------

// #region Server Conn -------------------------------------------------


let response = await fetch(regURL, { 
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify(credentials)
 });
  
if(response.status < 300){
    response = await response.json();
    token = response.token;
    requestHeaders.Authorization = token;
}else{
    console.log(`Client-Server Error:\n${response}`);
} 
  
async function getQuestion(){
    response = await fetch(statusURL, { 
        method: "GET",
        headers: requestHeaders,
    });
  
    if (response.status == 200){
        response = await response.json();
    }
    return response;
} 
  
// #endregion -------------------------------------------------------------

// #region Question Logic -------------------------------------------------------

async function answerQuestion(answer){
    let answerObject = {"answer" : answer};

    response = await fetch(answerURL, { 
        method: "POST",
        headers: requestHeaders(),
        body:JSON.stringify(answerObject)
    });
    
    if(response.status == 200){
        response = await response.json();
    }
    
    if (response.correct){
        return colors.green + "Correct!" + colors.white;    
    }else{
        return colors.red + String(response.message) + colors.white;
    }
}

let alchemyDictionary = {
    "☉" : "Gold",
    "☿" : "Quicksilver",
    "☽" : "Silver",
    "♂" : "Iron"
}

function alchemicalDecoder(code){
    let decoded = "";
    code = String(code);
    for(let letter of code){
        decoded += alchemyDictionary[letter];
    }
    return decoded;
}

// Logic gates
function andGate(a, b){
    return a && b;
}

function andNotGate(a, b){
    return (! (a && b))
}

function notGate(a){
    return (!a)
}

function orGate(a, b){
    if (a || b){
        return true;
    }else{
        return false;
    }
}

function xorGate(a, b){
    return (a && !b) || (!a && b);
}

function resetCircuit(){
    return {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false
    }
}

    //outputPoints["a"] = orGate( andGate(inputPoint["a"], inputPoint["b"]) , notGate(inputPoint("c")));
    //outputPoints["b"] = andNotGate( xorGate( inputPoint["c"], inputPoint["d"] ) , andGate(inputPoint["d"], inputPoint["e"]));
    
function circuitSimulation(inputPoint){

    //console.table(inputPoint);

    let returnValue = "";
    let outputPoints = {
        "a": false,
        "b": false
    }
    
    outputPoints["a"] = orGate( andGate(inputPoint[0], inputPoint[1]) , notGate(inputPoint[2]));
    outputPoints["b"] = andNotGate( xorGate( inputPoint[2], inputPoint[3] ) , andGate(inputPoint[3], inputPoint[4]));
    
    //console.table(outputPoints);


    if (outputPoints["a"] == true){ returnValue += "1"} else { returnValue += "0"};
    if (outputPoints["b"] == true){ returnValue += "1"} else { returnValue += "0"};

    return returnValue;
}

function binaryCircuitDecoder(binaryInput){
    let inputPoints = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false
    }

    let returnValue = "";
    let binaryCounter = 0;

    for(let singleBit of binaryInput){
        if (singleBit == '0'){
            inputPoints[binaryCounter] = false;
        }else if(singleBit == '1'){
            inputPoints[binaryCounter] = true;
        }else{
            console.log("BIG ERROR");
        }

        if (binaryCounter == 4){

            returnValue += circuitSimulation(inputPoints);
            
            binaryCounter = 0;
            inputPoints = resetCircuit();
            continue;
        }
        binaryCounter += 1;
    }

    //returnValue += circuitSimulation(inputPoints)

    return returnValue;
}


let alphabet = "abcdefghijklmnopqrstuvwxyz";
function labDecode(codedWord, key){

    let decodedWord = "";
    let keyNum = 0;

    for(let codeLetter of codedWord){
        for(let keyLetter of key){
            (codeLetter == keyLetter) ? decodedWord += alphabet[keyNum] :  keyNum+=1;
        }
        keyNum = 0;
    }

    return decodedWord;
}


// #endregion -------------------------------------------------------------
  
// #region Main -------------------------------------------------------

function printc(text, color){
    console.log(colors[color] + text + colors['reset']);
}

async function init(){
    printc("Portfolio assignment Jonas | Netty", 'cyan');
    console.log("\n");

    let currentCache = getCache();
    let questionData = await getQuestion();
    
    printc("Current Question: " + questionData.challengeId, "cyan")
    printc(questionData.prompt, 'yellow');
    console.log('\n');

    switch(questionData.challengeId){
        case 1:
            printc("answering 1", 'cyan');
            console.log(await answerQuestion(4));
            break;
        case 2:
            printc("answering 2", 'cyan');
            console.log(await answerQuestion("pi"));
            break;
        case 3:
            let codeWord = questionData.prompt.split("“")[1].split("”")[0];
            let decodedWord = alchemicalDecoder(codeWord);
            printc("Decoded: " + decodedWord, 'cyan');
            console.log(await answerQuestion(decodedWord));
            break;
        case 4:
            let brokenPoem = questionData.prompt.split("“")[1].split("”")[0];
            let decryptedPoem = brokenPoem.replace(/[a-z\W_]/g, "");
            
            printc(brokenPoem, 'magenta');
            printc(decryptedPoem, 'cyan');

            console.log(await answerQuestion(decryptedPoem));
            break;
        case 5:
            let binaryCode = questionData.prompt.split('"')[1];
            printc(binaryCode,'magenta');
            let circuitOuput = binaryCircuitDecoder(binaryCode)

            printc("Circut Simulation:\n" + circuitOuput,'magenta');

            console.log(await answerQuestion(circuitOuput));
            break;

        case 6:
            let labNotes = await fetch("https://alchemy-kd0l.onrender.com/notes.md");
            let codedNotes = await fetch("https://alchemy-kd0l.onrender.com/strangeNote.txt");
            labNotes = await labNotes.text();
            
            codedNotes = (await codedNotes.text()).split(/[\n\s]/);
            codedNotes = codedNotes.filter(item => item !== '');

            let labCipherKey = labNotes.replace(/[a-z\W_]/g, "")

            printc("Cipher Key: " + labCipherKey, 'magenta');
            printc("Strange Notes: " + codedNotes, 'magenta');

            printc("Decoding...", 'cyan')

            let decipheredNotes = [];
            for(let strangeWords of codedNotes){
                decipheredNotes.push(labDecode(strangeWords, labCipherKey));
            }
            console.log(decipheredNotes);

            console.log(answerQuestion(decipheredNotes));
            break;
        default:
            printc("No answer registered", 'cyan');
    }

}

init();
  

// #endregion -------------------------------------------------------------