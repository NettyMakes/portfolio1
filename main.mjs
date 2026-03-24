// Portfolio assignment Jonas | Netty
import fs from "node:fs"
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
    green: "\u001b[32m",
    cyan: "\u001b[36m",
    white: "\u001b[37m"
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
  
// #region Logic -------------------------------------------------------

function init(){
    console.log(colors.cyan + "Portfolio assignment Jonas | Netty");

    let currentCache = getCache();

    //let questionData = getQuestion();
  
    console.log(currentCache);
}
  
init();
  

// #endregion -------------------------------------------------------------
  
/*
const answer = { "answer": 4 }
  
response = await fetch(regURL, { 
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(answer)
 });
  
if(response.status == 200){
    response = await response.json();
} 
  
console.log(response);
*/
  