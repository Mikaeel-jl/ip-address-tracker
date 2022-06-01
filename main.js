// input , button
const inputIp = document.querySelector('.input-ip');
const searchIpBtn = document.querySelector('.search-ip-btn');

// results 
const ipEl = document.querySelector('#ip');
const locationEl = document.querySelector('#location');
const timezoneEl = document.querySelector('#timezone');
const ispEl = document.querySelector('#isp');

// leaflet Js Map
const map = L.map('map');

function displayMap(lat, lng) {
  map.setView([lat, lng], 10);

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoibWlrYWVlbDkyMSIsImEiOiJja3k1bHU2NXYwbmUzMnVvbnlnOWN6Ymc1In0.SQB-KLSB4yOSXp5fy-zApA',
    }
  ).addTo(map);

  blackIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [46, 56], // size of the icon
  });

  L.marker([lat, lng], { icon: blackIcon }).addTo(map);
}

// displayMap(52.37403,4.88969)
function getJson(ip = '') {
  return fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_tcbgdkV1Vbw4mIPdoz6xPV10MyWef&ipAddress=${ip}`
  ).then((response) => response.json());
}

// user location info
(function () {
  getJson()
    .then((data) => {
      const country = data.location.country;
      const city = data.location.city;

      ipEl.textContent = data.ip;
      locationEl.textContent = `${country} , ${city}`;
      timezoneEl.textContent = `UTC ${data.location.timezone}`;
      ispEl.textContent = data.isp;

      displayMap(data.location.lat, data.location.lng);
    })
    .catch((err) => console.error(err));
})();

// input location info
function getLocationIp() {
  const ip = inputIp.value;

  // test ip with regex
  const regexIp =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (!regexIp.test(ip)) {
    inputIp.style.border = '2px solid red';
    inputIp.value = '';
    inputIp.setAttribute('placeholder', 'Enter a Valid IP ❌');

    return; // if don't return, send an empty value to Ipfy server : empty value = your location
  } else {
    inputIp.style.border = '2px solid #8bc32a';
    inputIp.value = '';
    inputIp.setAttribute('placeholder', 'Valid ✅');
  }
  getJson(ip)
    .then((data) => {
      console.log(data);
      const country = data.location.country;
      const city = data.location.city;

      ipEl.textContent = data.ip;
      locationEl.textContent = `${country} , ${city}`;
      timezoneEl.textContent = `UTC ${data.location.timezone}`;
      ispEl.textContent = data.isp;

      displayMap(data.location.lat, data.location.lng);
    })
    .catch((err) => console.error(err));
}

// Event listner
searchIpBtn.addEventListener('click', getLocationIp);
