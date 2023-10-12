const icon = document.querySelector("#menu-icon");
const colorPicker = document.querySelector("#accent");
const nav = document.querySelector(".settings");
const darkModeInput = document.querySelector("#mode");
const colorInput = document.querySelector("#accent");
const timeInput = document.querySelector("#time");
const birthDateInput = document.querySelector("#bd");
const nameLabel = document.querySelector(".user--name");
const nameInput = document.querySelector("#name");

//date labels ---

const yearLabel = document.getElementById("year");
const mounthLabel = document.getElementById("mounth");
const dayLabel = document.getElementById("day");
const hourLabel = document.getElementById("hour");
const minuteLabel = document.getElementById("minute");
const secondLabel = document.getElementById("second");
const modeName = document.getElementById("mode-display");
// --------------
let props = {
    userName : "",
    birthDate : "",
    birthTime : "",
    accentColor : "#EE0F2A",
    isDarkMode : true
}
nameInput.addEventListener("input" , (e)=>{
    props.userName = e.target.value;
    nameLabel.textContent = e.target.value;
    updateLocalStorage();
})
birthDateInput.addEventListener("change" , (e)=>{
    props.birthDate = e.target.value;
    updateLocalStorage();
})
timeInput.addEventListener("change" , (e)=>{
    props.birthTime = e.target.value + " : 00";
    updateLocalStorage();
})
icon.addEventListener("click" , ()=>{
    nav.classList.toggle("shown");
})
colorPicker.addEventListener("input" ,(e) => {
    document.documentElement.style.setProperty("--accent-clr" ,e.target.value);
    props.accentColor = e.target.value;
    updateLocalStorage();
})
darkModeInput.addEventListener("change" ,(e) => {
    props.isDarkMode = e.target.checked;
    modeName.textContent = props.isDarkMode ? "Dark" : "Light";
    if(props.isDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    updateLocalStorage();
})
function updateLocalStorage(){
    localStorage.setItem("props" , JSON.stringify(props))
    // console.log(props)
}
addEventListener("load" , (e)=>{
    let propsString = localStorage.getItem("props")
    if(!propsString) {
        updateLocalStorage();
        nav.classList.toggle("shown");
        return;
    };
    propsString = localStorage.getItem("props");
    props = JSON.parse(propsString);
    setupSettings();
})

function setupSettings(){
    colorInput.value = props.accentColor;
    document.documentElement.style.setProperty("--accent-clr" ,props.accentColor);
    nameInput.value = props.userName;
    birthDateInput.value = props.birthDate;
    nameLabel.textContent = props.userName;
    darkModeInput.checked = props.isDarkMode;
    timeInput.value = props.birthTime.slice(0,props.birthTime.lastIndexOf(":")).trim();
    modeName.textContent = props.isDarkMode ? "Dark" : "Light";
    if(props.isDarkMode) document.body.classList.add("dark");
    calculateAge()
}

function calculateAge(){
    let currentDate = new Date();
    let birthDate = new Date(props.birthDate);
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        days = lastMonth.getDate() - birthDate.getDate() + currentDate.getDate();
    }
    let [hours,minutes,seconds] = props.birthTime.split(":").map(e => +e.trim());
    let currentHours = currentDate.getHours()
    if (currentHours < hours) {
        currentHours += 12; 
        hours = 12 + currentHours - hours;
    }
    else{
        hours = currentHours - hours;
    }
    minutes = currentDate.getMinutes() - minutes;
    seconds = currentDate.getSeconds() - seconds;
    if (seconds < 0) {
        minutes--;
        seconds += 60;
    }

    if (minutes < 0) {
        hours--;
        minutes += 60;
    }
    if(hours < 0){
        days--;
        hours+=24;
    }
    if(days < 0){
        months--;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if(months < 0){
        years--;
        months += 12;
    }

    return {years,months,days,hours,minutes,seconds}
}

function update(){
    if(props.birthDate === "" || props.birthTime === "") return;
    let { years , months , days , hours,minutes,seconds} = calculateAge();
    if(years < 10) years = `0${years}`;
    if(months < 10) months = `0${months}`;
    if(days < 10) days = `0${days}`;
    if(hours < 10) hours = `0${hours}`;
    if(minutes < 10) minutes = `0${minutes}`;
    if(seconds < 10) seconds = `0${seconds}`;
    yearLabel.textContent = years;
    mounthLabel.textContent = months
    dayLabel.textContent = days;
    hourLabel.textContent = hours
    minuteLabel.textContent = minutes
    secondLabel.textContent = seconds;
}
setInterval(update,1000);