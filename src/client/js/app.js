//API URLS and Keys

//geoNames URL and api key 
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const geoNamesKey = "stamay";

//weatherbit urls and apikey
const weatherbitforecastURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbithistoryURL = 'https://api.weatherbit.io/v2.0/history/daily?lat=';
const weatherbitkey = '70873701a15540d0af0d77fca47152a6';


//Pixabay URL and apikey 
const pixabayAPIURL = "https://pixabay.com/api/?key=";
const pixabayAPIkey = "17380403-46495629e66206dbcae5417ad";


// VARIABLES

const result = document.getElementById("result");
const home = document.getElementById('home');
const print = document.getElementById("print");
const clear = document.getElementById("clear");
const form = document.getElementById("form");
const from = document.querySelector('input[name="from"]');
const to = document.querySelector('input[name="to"]');
const travelDate = document.getElementById('travel_date');
const returnDate = document.getElementById('re_date');


const sub = document.getElementById('sub');
sub.addEventListener('click', addTrip);

const clearData = clear.addEventListener('click', function(e){
    form.reset();
  location.reload();
});

print.addEventListener('click', printScreen);



//print button
export function printScreen() {
  window.print();
  location.reload();
}

//Delete button

const details= {};

// Function called when submit button is clicked

export function addTrip(e) {
  

  document.getElementById("dialog").showModal();
  home.classList.add("blur_home");

  e.preventDefault();

  details['fromText'] = from.value;
  details['toText'] = to.value;
  details['dateText'] = travelDate.value;
  details['returnText'] = returnDate.value; 

  const date1 = new Date(details['dateText']);
  const date2 = new Date(details['returnText']);

  details['fullDate'] = date2.getDate() - date1.getDate(); 

  const timestamp = (new Date(details['dateText']).getTime()) / 1000;
  const timestampNow = (Date.now()) / 1000;




cityInfo(geoNamesURL, details['toText'], geoNamesKey)
  .then((cityInformation) => {
    const lat = cityInformation.geonames[0].lat;
    const long = cityInformation.geonames[0].lng;
    const country = cityInformation.geonames[0].countryName;
    details['countryCode'] = cityInformation.geonames[0].countryCode;
    
    const weatherData = weatherInfo(lat, long, country, timestamp)
    return weatherData;

  }).then((weatherData) => {
      details['daysLeft'] = Math.round((timestamp - timestampNow) / 86400);
    details['summary'] =  weatherData.data[0].weather.description;
     details['maxTemp'] = weatherData.data[0].max_temp;
     details['minTemp'] = weatherData.data[0].min_temp;
    
     return getFlag(details['countryCode']);
  })
  .then((contCode) =>{
    details['flag'] = contCode.flag;
    details['language'] = contCode.languages[0].name;
    details['region'] = contCode.region;
    details['curr'] = contCode.currencies[0].name;

     return getImage(details['toText']);
  })
  .then((imageDetails) => {
    if (imageDetails['hits'].length > 0) {
      details['cityImage'] = imageDetails.hits[0].webformatURL;
  }
    const userData = postData(details);
          return userData;
  }).then((userData) => {
    updateUI(userData);
  })
}


//function getCityInfo to get city information from Geonames (latitude, longitude, country)

export const cityInfo = async (geoNamesURL, toText, geoNamesKey) => {
  // res equals to the result of fetch function
  const geoNamesFullURL = geoNamesURL + toText + "&maxRows=10&" + "username=" + geoNamesKey;
  const response = await fetch(geoNamesFullURL);
  try {
    const cityInformation = await response.json();
    return cityInformation;
    console.log(cityInformation);
  } catch (error) {
    console.log("error", error);
  }
};

// function getWeather to get weather information from Dark Sky API 

export const weatherInfo = async (lat, long, country, timestamp) => {

    // Getting the timestamp for the current date and traveling date for upcoming processing.
    const timestampTrip = Math.floor(new Date(travel_date).getTime() / 1000);
    const todayDate = new Date();
    const timestampToday = Math.floor(new Date(todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()).getTime() / 1000);

    let res;
    // Check if the date is gone and call the appropriate endpoint.
    if (timestampTrip < timestampToday) {
        const next_date = new Date(dateText);
        next_date.setDate(next_date.getDate() + 1);
        const fullHistoryURL = weatherbithistoryURL + lat + '&lon=' + long + '&start_date=' +dateText+ '&end_date=' + next_date + '&key=' + weatherbitkey;
        res = await fetch(fullHistoryURL);
    } else {
        const fullForecastURL = weatherbitforecastURL + lat + '&lon=' + long + '&key=' + weatherbitkey;
        res = await fetch(fullForecastURL);
    }

    try {
        const weather = await res.json();
        return  weather;
    } catch (e) {
        console.log('error', e)
    }
}


export const getImage = async(toText)=>{
  const res = await fetch(pixabayAPIURL + pixabayAPIkey + "&q=" + toText+ "+city&image_type=photo");
  try{
    const img = await res.json();
    return img ;
  }
  catch(e){
    console.log('error', e);
  }}


  async function getFlag(countryCode){

  const response = await fetch('https://restcountries.eu/rest/v2/alpha/'+countryCode);
try{
  const res = await response.json();
  return res;
}
catch(e){
  console.log('error', e);
}

  }

// Function postData to POST data to our local server
async function postData(details) {
  const response = await fetch('http://localhost:3500/postData', {
      method: "POST",
      credentials: 'same-origin',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(details)
  });

  try {
    const userData =   await response.json();
      return userData;
  } catch (e) {
      console.log('error', e);
  }
}

// Function update UI that reveals the results page with updated trip information including fetched image of the destination

export const updateUI = async (userData) => {
  


  try {
    document.getElementById("destination").innerHTML = userData.toText;
    document.getElementById("location").innerHTML = userData.fromText;
    document.getElementById("full_days").innerHTML = userData.fullDate;
    document.getElementById("days").innerHTML = userData.daysLeft;
    document.getElementById("summary").innerHTML = userData.summary;
    document.getElementById("maxTemp").innerHTML = userData.maxTemp;
    document.getElementById("minTemp").innerHTML = userData.minTemp;
    document.getElementById("language").innerHTML = userData.language;
    document.getElementById("curr").innerHTML = userData.curr;
    document.getElementById("region").innerHTML = userData.region;
    document.getElementById('flag').setAttribute('src',userData.flag);
   document.getElementById("city_img").setAttribute('src', userData.cityImage);
    
  }
  catch (error) {
    console.log("error", error);
  }
}

export{clearData}
