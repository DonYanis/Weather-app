const search=document.querySelector('.search-btn')
const getPosition=document.querySelector('.position')
const searchField=document.querySelector('.search input')
const closePopup=document.querySelector('.close')
const Popup=document.querySelector('.city-not-found')
const loading=document.querySelector('.load-box')



let WeatherAPI={
    key : "4b34f75bdfaadc584abf9192242bdac9",

    fetchWeather : function (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.key}`)
        .then((response) => response.json())
        .then((data) => this.getWeatherDetails(data))
    },

    fetchWeatherWithLatLon : function (lat,lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.key}`)
        .then((response) => response.json())
        .then((data) => this.getWeatherDetails(data))
    },

    getWeatherDetails : function(data){
        loading.classList.add('hide')
        const {cod} = data
        if (cod === 200){
            const {name,timezone} = data
            const {main,icon,description} = data.weather[0]
            const {temp,humidity} = data.main
            const {speed} = data.wind
            const {sunrise,sunset} = data.sys

            document.querySelector('.container').style.backgroundImage=`linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.9)), url("https://source.unsplash.com/1920x1080/?${name}")`
            document.querySelector('.icon').setAttribute('src',`https://openweathermap.org/img/wn/${icon}.png`)
            document.querySelector('.icon').style.display='block'
            document.querySelector('.city-name').innerHTML=`${name}`
            document.querySelector('.temperature').innerHTML=`${temp}°C`
            document.querySelector('.description').innerHTML=description
            document.querySelector('.humidity').innerHTML=`Humidity : ${humidity}%`
            document.querySelector('.wind').innerHTML=`Wind : ${parseInt(speed*3.6)} km/h`
            document.querySelector('.time').innerHTML=`Time : ${getTimeFromTimeZone(timezone)}`
            document.querySelector('.sunrise').innerHTML=`Sunrise : ${getTimeFromSeconds(sunrise,timezone)}`
            document.querySelector('.sunset').innerHTML=`Sunset : ${getTimeFromSeconds(sunset,timezone)}`
        
        }else{
            Popup.classList.remove('hidden')
        } 
    }
}

function getTimeFromSeconds(seconds,timeZoneInSeconds){
    let c=""
    let currentdate=new Date()
    let date= new Date(seconds*1000+timeZoneInSeconds*1000+currentdate.getTimezoneOffset()*60*1000)
    timeZoneInSeconds >=0 ? c="+" : c="-"
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (GMT ${c}${Math.abs(timeZoneInSeconds/3600)})`
}

function getTimeFromTimeZone(timezone){
    let c=""
    let currentdate=new Date()
    let date = new Date(currentdate.getTime()+timezone*1000+currentdate.getTimezoneOffset()*60*1000)
    timezone >=0 ? c="+" : c="-"
    return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} (GMT ${c}${Math.abs(timezone/3600)})`

}

search.addEventListener('click',()=>{
    if(searchField.value !==""){
        loading.classList.remove('hide')
        WeatherAPI.fetchWeather(searchField.value)
    }
})

closePopup.addEventListener("click",()=>{
    Popup.classList.add('hidden')
})

searchField.addEventListener("keypress",(e)=>{
    if(searchField.value !=="" && e.keyCode===13){
        loading.classList.remove('hide')
        WeatherAPI.fetchWeather(searchField.value)
    }
})

//failure and succes callbacks for get current pos:
const failure=()=>console.log
const succes=postion => { 
    let lat=postion.coords.latitude
    let lon=postion.coords.longitude
    WeatherAPI.fetchWeatherWithLatLon(lat,lon)
}


getPosition.addEventListener("click",()=>{
    loading.classList.remove('hide')
    if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(succes,failure)  
    }else{
        loading.classList.add('hide')
    }
})
