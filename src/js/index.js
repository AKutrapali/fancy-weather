import '../css/style.css';
import '../css/style.scss';

const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
document.body.append(wrapper);

const control = document.createElement('div');
control.className = 'control';
wrapper.append(control);

const buttons = document.createElement('div');
buttons.className = 'buttons';
control.append(buttons);

const reloadButton = document.createElement('div');
reloadButton.className = 'button';
reloadButton.innerText = '⥁';
reloadButton.style.fontWeight = 'bold';
buttons.append(reloadButton);

const temperatureButton = document.createElement('div');
temperatureButton.className = 'button';
temperatureButton.innerText = '*C/*F';
buttons.append(temperatureButton);

const langueButton = document.createElement('div');
langueButton.className = 'button';
langueButton.innerText = 'Eng';
buttons.append(langueButton);

const inputCityBlock = document.createElement('div');
inputCityBlock.className = 'input_city_block';
control.append(inputCityBlock);

const inputCity = document.createElement('input');
inputCity.webkitSpeech = true;
inputCity.className = 'input_city';
inputCityBlock.append(inputCity);

const buttonCity = document.createElement('div');
buttonCity.className = 'button_city';
inputCityBlock.append(buttonCity);

const buttonMicrophone = document.createElement('div');
buttonMicrophone.className = 'button_microphone';
buttonMicrophone.innerText = 'MIC';
inputCityBlock.append(buttonMicrophone);

const output = document.createElement('div');
output.className = 'output';
wrapper.append(output);

const dataOutput = document.createElement('div');
dataOutput.className = 'data_output';
output.append(dataOutput);

const cityBlock = document.createElement('div');
cityBlock.className = 'city_block';
dataOutput.append(cityBlock);

const dateBlock = document.createElement('div');
dateBlock.className = 'date_block';
dataOutput.append(dateBlock);

const temperatureTodayBlock = document.createElement('div');
temperatureTodayBlock.className = 'temperature_today_block';
dataOutput.append(temperatureTodayBlock);

const temperatureNowBlock = document.createElement('div');
temperatureNowBlock.className = 'temperature_now_block';
temperatureTodayBlock.append(temperatureNowBlock);

const temperatureNow = document.createElement('div');
temperatureNow.className = 'temperature_now';
temperatureNowBlock.append(temperatureNow);

const sunOrClouds = document.createElement('div');
sunOrClouds.className = 'sun_clouds';
temperatureNowBlock.append(sunOrClouds);

const sunOrCloudsSvg = document.createElement('div');
sunOrCloudsSvg.className = 'sun_clouds_svg';
temperatureNowBlock.append(sunOrCloudsSvg);

const parameterTodayBlock = document.createElement('div');
parameterTodayBlock.className = 'parameter_today_block';
temperatureTodayBlock.append(parameterTodayBlock);

const parameterToday = [];
for (let i = 0; i < 6; i++) {
  parameterToday[i] = document.createElement('div');
  parameterToday[i].className = 'parameter_today';
  parameterTodayBlock.append(parameterToday[i]);
}

const temperatureFutureBlock = document.createElement('div');
temperatureFutureBlock.className = 'temperature_future_block';
dataOutput.append(temperatureFutureBlock);

const tempFutDay = [];
const paramBlock = [];
for (let i = 0; i < 3; i++) {
  tempFutDay[i] = document.createElement('div');
  tempFutDay[i].className = 'temp_fut_day';
  temperatureFutureBlock.append(tempFutDay[i]);
  for (let j = 0; j < 3; j++) {
    paramBlock[j] = document.createElement('div');
    paramBlock[j].className = 'param_block_fut';
    tempFutDay[i].append(paramBlock[j]);
  }
}

const mapBox = document.createElement('div');
mapBox.className = 'mapbox';
output.append(mapBox);

const map = document.createElement('iframe');
map.className = 'map';
mapBox.append(map);

const mapCoordinates = document.createElement('div');
mapCoordinates.className = 'map_coordinates';
mapBox.append(mapCoordinates);

const futureBlockInDetail = document.createElement('div');
futureBlockInDetail.className = 'future_block_detail';
futureBlockInDetail.style.display = 'none';
wrapper.append(futureBlockInDetail);

let dataCity;
let dataWeather;
let dataImage;
let city = 'minsk';
let langue = Number(localStorage.getItem('langue'));
let celsiusForrengate = localStorage.getItem('celsiusForrengate');
const crd = {};
let descriptionWeather = '';
let dayNight = '';
let timeOfYear = '';
let hours;
let dayWeek;
const langueText = ['ru', 'by', 'en'];
const coordText = [
  ['Широта: ', 'Шырата: ', 'Latitude: '],
  ['Долгота: ', 'Даугата: ', 'Longitude: '],
];
const buttonCityText = ['Поиск', 'Шукаць', 'Search'];

buttonCity.innerText = buttonCityText[langue];

async function getLinkBackImage() {
  const url = `https://api.unsplash.com/photos/random?query=town,${dayNight},${timeOfYear},${descriptionWeather}&client_id=9c3230614940bfbaeed09605f3b758cee051f9ece0bfec464e0e9d490d60be10`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getEncodingCity() {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=15c4be00ee254ea59f42493bb14ec46b&language=${langueText[langue]}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getDataWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${langueText[langue]}&units=metric&APPID=efec206396a1b1c678bc209e7048e5b9`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function showCityName() {
  let cityName = dataCity.results[0].components.city;
  if (cityName === undefined) cityName = dataCity.results[0].components.state;
  cityBlock.innerText = `${cityName}, ${dataCity.results[0].components.country}`;
}

function showMapAndCoordinates() {
  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${crd.longitude * 0.999}%2C${crd.latitude * 0.999}%2C${crd.longitude * 1.001}%2C${crd.latitude * 1.001}&amp;layer=mapnik&amp;marker=${crd.latitude}%2C${crd.longitude}`;
  mapCoordinates.innerText = `${coordText[0][langue] + (crd.latitude).toFixed(4)}\r\n${coordText[1][langue]}${(crd.longitude).toFixed(4)}`;
}

function getUserCoordinates(resolve) {
  function success(pos) {
    crd.latitude = pos.coords.latitude;
    crd.longitude = pos.coords.longitude;
    resolve();
  }
  navigator.geolocation.getCurrentPosition(success);
}

function getDate() {
  const daysWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const date = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };
  options.timeZone = dataCity.results[0].annotations.timezone.name;
  const dateDisplay = date.toLocaleString(`${langueText[langue]}-${langueText[langue]}`, options);
  hours = date.toLocaleString(`${langueText[langue]}-${langueText[langue]}`, { hour: 'numeric', hour12: false, timeZone: `${dataCity.results[0].annotations.timezone.name}` });
  const dayWeekName = date.toLocaleString(`${langueText[langue]}-${langueText[langue]}`, { weekday: 'long', timeZone: `${dataCity.results[0].annotations.timezone.name}` });
  dayWeek = (daysWeek.indexOf(dayWeekName)) + 1;
  dateBlock.innerHTML = dateDisplay;
  if (date.getHours() < 17 && date.getHours() > 8) {
    dayNight = 'day';
  } else {
    dayNight = 'night';
  }
  if (date.getMonth() === 10 || date.getMonth() === 11 || date.getMonth() === 0 || date.getMonth() === 1) {
    timeOfYear = 'winter';
  } else {
    timeOfYear = 'summer';
  }
}

function temperatureBlockFilling() {
  let minPlace;
  let srcSvg;
  const tempTodayText = [
    ['Температура сейчас: ', 'Цемпература зараз: ', 'temperature now: '],
    ['Описание: ', 'Апісанне: ', 'Description: '],
    ['Температура днем: ', 'Цемпература днем: ', 'temperature the day: '],
    ['Температура ночью: ', 'Цемпература ноччу: ', 'temperature at night: '],
    ['Ощущаемая температура: ', 'Адчуваемая цемпература: ', 'perceived temperature: '],
    ['Скорость ветра: ', 'Хуткасць паветра: ', 'wind speed: '],
    ['Влажность: ', 'Вільготнасць: ', 'humidity: ']];

  function searchPlaceInList() {
    minPlace = Math.round((26 - hours) / 3);
  }

  function conversionCelForr(temp) {
    if (celsiusForrengate === 'celsius') return `${temp}*C`;
    const forr = ((temp * 1.8) + 32).toFixed(2);
    return `${forr}*F`;
  }

  function choiceSvg(n) {
    if (/01/i.test(n)) srcSvg = 'url(icons/day_clear.svg)';
    if (/02/i.test(n)) srcSvg = 'url(icons/day_partial_cloud.svg)';
    if (/03/i.test(n) || /04/i.test(n)) srcSvg = 'url(icons/cloudy.svg)';
    if (/10/i.test(n) || /11/i.test(n)) srcSvg = 'url(icons/rain.svg)';
    if (/13/i.test(n) || /14/i.test(n)) srcSvg = 'url(icons/snow.svg)';
  }

  searchPlaceInList();
  const dayWeeks = [
    ['Пн', 'Пан', 'Mon'],
    ['Вт', 'Аут', 'Tu'],
    ['Ср', 'Ср', 'We'],
    ['Чт', 'Чат', 'Th'],
    ['Пт', 'Пят', 'Fr'],
    ['Сб', 'Суб', 'Sa'],
    ['Вс', 'Няд', 'Su'],
  ];
  choiceSvg(dataWeather.list[0].weather[0].icon);
  if (city !== 'minsk') {
  crd.longitude = dataWeather.city.coord.lon;
  crd.latitude = dataWeather.city.coord.lat;}
  temperatureNow.innerText = `${tempTodayText[0][langue] + conversionCelForr(dataWeather.list[0].main.temp)}`;
  sunOrClouds.innerText = tempTodayText[1][langue] + dataWeather.list[0].weather[0].description;
  descriptionWeather = dataWeather.list[0].weather[0].description;
  sunOrCloudsSvg.style.backgroundImage = srcSvg;
  parameterToday[0].innerText = `${tempTodayText[2][langue] + conversionCelForr(dataWeather.list[0].main.temp)}`;
  parameterToday[1].innerText = `${tempTodayText[3][langue] + conversionCelForr(dataWeather.list[minPlace].main.temp)}`;
  const perceivedTemperature = (dataWeather.list[0].main.temp - 0.4 * (dataWeather.list[0].main.temp - 10) * (1 - (dataWeather.list[0].main.humidity / 100))).toFixed(2);
  parameterToday[2].innerText = `${tempTodayText[4][langue] + conversionCelForr(perceivedTemperature)}`;
  parameterToday[3].innerText = `${tempTodayText[5][langue] + dataWeather.list[0].wind.speed}m/s`;
  parameterToday[4].innerText = `${tempTodayText[6][langue] + dataWeather.list[0].main.humidity}%`;
  for (let i = 0; i < 3; i++) {
    const n = (i + 1) * 8;
    choiceSvg(dataWeather.list[n].weather[0].icon);
    const item1 = tempFutDay[i].children.item(0);
    const item2 = tempFutDay[i].children.item(1);
    const item3 = tempFutDay[i].children.item(2);
    let futureDay = i + dayWeek;
    if (futureDay > 6) futureDay -= 7; 
    item1.innerText = dayWeeks[futureDay][langue];
    item2.style.backgroundImage = srcSvg;
    item2.style.height = '2em';
    item3.innerText = conversionCelForr(dataWeather.list[n].main.temp);
  }
}

function showDetailsFutureTemperatureBlock() {
  const detailsTemperatureTitle = ['Детальное описание температуры:', 'Падрабязная тэмпература:', 'Detail temperature:'];
  futureBlockInDetail.innerText = `${detailsTemperatureTitle[langue]}\r\n`;
  for (let i = 0; i < 20; i++) {
    const data = dataWeather.list[i].dt_txt;
    const listTemp = dataWeather.list[i].main.temp;
    futureBlockInDetail.innerText += `${data} : ${listTemp}*C;\r\n`;
  }
}

function DrawingToBackImage() {
  const linkToImage = `${dataImage.urls.small}`;
  wrapper.style.background = `url(${linkToImage}) no-repeat center center fixed`;
  wrapper.style.backgroundSize = 'cover';
}

function jumpingButtons() {
  // eslint-disable-next-line no-restricted-globals
  const { target } = event;
  target.style.position = 'absolute';
  target.style.width = '8%';
  const height = wrapper.clientHeight - target.clientHeight;
  const width = 700 * Math.random();

  function makeEaseOut(timing) {
    return function (timeFraction) {
      return 1 - timing(1 - timeFraction);
    };
  }

  function bounce(timeFraction) {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return -(((11 - 6 * a - 11 * timeFraction) / 4) ** 2) + (b ** 2);
      }
    }
  }

  function quad(timeFraction) {
    return (timeFraction ** 2);
  }

  function animate({ timing, draw, duration }) {
    const start = performance.now();
    // eslint-disable-next-line no-shadow
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      const progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) requestAnimationFrame(animate);
    });
  }

  animate({
    duration: 2000,
    timing: makeEaseOut(bounce),
    draw(progress) {
      target.style.top = `${height * progress}px`;
    },
  });

  animate({
    duration: 2000,
    timing: makeEaseOut(quad),
    draw(progress) {
      target.style.left = `${width * progress}px`;
    },
  });
}

// eslint-disable-next-line
const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// eslint-disable-next-line
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// eslint-disable-next-line
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function testSpeech() {
  const phrase = 'hello';
  inputCity.value = 'говорите';
  const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    inputCity.value = event.results[0][0].transcript.toLowerCase();
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onerror = function () {
    inputCity.value = 'Error ';
  };
}

buttonMicrophone.addEventListener('click', testSpeech);

async function fullLoad() {
  new Promise(getUserCoordinates)
    .then(showMapAndCoordinates);
  dataCity = await getEncodingCity();
  showCityName();
  getDate();
  dataWeather = await getDataWeather();
  temperatureBlockFilling();
  dataImage = await getLinkBackImage();
  DrawingToBackImage();
  setInterval(getDate, 30000);
}

fullLoad();

buttonCity.onclick = function () {
  city = inputCity.value;
  async function load() {
    dataCity = await getEncodingCity();
    showCityName();
    getDate();
    dataWeather = await getDataWeather();
    temperatureBlockFilling();
    dataImage = await getLinkBackImage();
    DrawingToBackImage();
    showMapAndCoordinates();
  }
  load();
};

langueButton.onclick = function () {
  const langueTexts = ['Рус', 'Бел', 'Eng'];
  langue += 1;
  if (langue === 3) langue = 0;
  localStorage.removeItem('langue');
  localStorage.setItem('langue', langue);
  langueButton.innerText = langueTexts[langue];
  buttonCity.innerText = buttonCityText[langue];
  mapCoordinates.innerText = `${coordText[0][langue] + crd.latitude}\r\n${coordText[1][langue]}${crd.longitude}`;
  async function intermediateFunction() {
    dataCity = await getEncodingCity();
    showCityName();
    dataWeather = await getDataWeather();
    temperatureBlockFilling();
  }
  intermediateFunction();
  getDate();
  showDetailsFutureTemperatureBlock();
};

temperatureButton.onclick = function () {
  if (celsiusForrengate === 'celsius') {
    celsiusForrengate = 'forrengate';
  } else {
    celsiusForrengate = 'celsius';
  }
  localStorage.setItem('celsiusForrengate', celsiusForrengate);
  temperatureBlockFilling();
};

reloadButton.onclick = function () {
  async function qw() {
    dataImage = await getLinkBackImage();
    DrawingToBackImage();
  }
  qw();
};

buttons.onclick = jumpingButtons;

temperatureFutureBlock.onclick = function () {
  futureBlockInDetail.style.display = 'flex';
  showDetailsFutureTemperatureBlock();
};

futureBlockInDetail.onclick = function () {
  futureBlockInDetail.style.display = 'none';
  futureBlockInDetail.innerText = '';
};

