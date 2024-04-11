const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`!@#$%^&*(){}[]_-+=~;:<.>,/?|"';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//set PasswordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;  
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
}
//this function will be further used to generate random value in case of integers as well as characters

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){ //async- jabtak ye complete na ho tabtk aage nhi bdna
    try{
        //this navigator method will copy the text in it's clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);         //await keyword can only be used in the async function, callback functions shine in async functions, when function has to wait for a file to load
        copyMsg.innerText = "copied";                                       //The await keyword makes the function pause the execution and wait for a resolved promise before it continues
    }
    catch(e){
        copyMsg.innerText = "failed";                                      //an object representing the eventual completion or failure of an asynchronous operation
    }                                                                      //Promises are used in async functions, for error prone. it contains 2 arguments (resolve, reject)
    copyMsg.classList.add("active");                                       //then() method is used to handle completion of a promise. 
    
    setTimeout(() => {                                                     //setTimeout uses callback function as an argument, and time after which it will be executed
        copyMsg.classList.remove('active');
    },2000);//time in ms
    
}
//jaise jaise slider aage peeche hoga vaise vaise password length change hoti rahegi
inputSlider.addEventListener('input', (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function shufflePassword(array){
    //Fisher Yates Method
    for( let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j]=temp;
    }
    // let str = "";
    // array.forEach((el) => (str += el));
    return array.join('');
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount <= 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password="";
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase); 
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber); 
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    
    //compulsory addition 
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining addition
    for(let i = 0; i<passwordLength -funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});