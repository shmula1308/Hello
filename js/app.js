const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('usernameInput')
const password = document.getElementById('passwordInput')
const greetingContainer = document.querySelector('.greeting-container')
const form = document.querySelector('form');
const countryInput = document.getElementById('languageInput');
const geolocInfo = document.querySelector('.geoloaction-info');
let langCode;

let userNm;

const loginStatus = {
    loggedIn: false
}


countryInput.addEventListener('change', (ev) => {
    let value = ev.target.value;
    if(!value) return;
    langCode = document.querySelector('option[value="' + value + '"]').dataset.code
   
})

loginBtn.addEventListener('click', () => {
    validateInput() 
})


logoutBtn.addEventListener('click', () => {
    changeButton();
    displayFarewell(userNm);
})


function validateInput() {
    userName.style.outline = 'none';
    password.style.outline = 'none';
    if(userName.value && password.value) {
        fetchIPAddress();
        changeButton();
        userNm = userName.value;  
        form.reset();
        return;
    }
    
    if(userName.value && !password.value ) {
        password.style.outline = '2px solid red';
        displayInvalidInput()
    }
    if(!userName.value && password.value ) {
        userName.style.outline = '2px solid red';
        displayInvalidInput()
        return;
    }
    if(!userName.value && !password.value ) {
        userName.style.outline = '2px solid red';
        password.style.outline = '2px solid red';
        displayInvalidInput()
        return;
    }
}

function changeButton() {
    if(loginStatus.loggedIn === false) {
        loginStatus.loggedIn = true;
        loginBtn.style.display = "none"
        logoutBtn.style.display = "block"
    } else {
        loginStatus.loggedIn = false;
        loginBtn.style.display = "block"
        logoutBtn.style.display = "none"
    }
}


function fetchIPAddress() {
    const uri = 'http://ip-api.com/json/';
    fetch(uri).then((response) => {
        return response.json();
    }).then(jsonData => {
            retrieveGreeting(jsonData.query)
            displayGeolocationInfo(jsonData)   
    }).catch((err) => {
        console.log("ERROR",err.message)
    })
}


function retrieveGreeting(ipAddress) {
    if(langCode) {
        var url = `https://fourtonfish.com/hellosalut/?lang=${langCode}&ip=${ipAddress}`;
    } 
    if(!langCode) {
        var url = `https://fourtonfish.com/hellosalut/?ip=${ipAddress}`;
    } 

   
    fetch(url)
    .then(request => request.json())
    .then(jsonData => {
        console.log('fourtonfish',jsonData)
        let decodedGreeting = decodeGreeting(jsonData.hello);
        displayGreeting(decodedGreeting)
    })
    .catch(err => {
        console.log(err.message)
    })
    langCode = null;
}

function decodeGreeting(codedGreeting) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = codedGreeting;
    return textarea.value;
}

function displayGreeting(greeting) {
    const h3 = document.createElement('h3');
    h3.className = 'greeting'
    h3.innerHTML = `${greeting} <span class="username">${userNm}</span>,</br> you have successfully
    logged in!`
    greetingContainer.appendChild(h3);
    setTimeout(() => {
        const greeting = document.querySelector('.greeting');
        greeting.remove();
      },2500)
      
    document.body.classList.add('after');


    if(loginStatus.loggedIn === true) {
        loginBtn.style.display = "none"
        logoutBtn.style.display = "block"
    }
}

function displayGeolocationInfo(data) {
    geolocInfo.innerHTML = "";
    geolocInfo.innerHTML = `<table>
    <tr>
      <th>KEY</th>
      <th>VALUE</th>
    </tr>
    <tr>
      <td>City</td>
      <td>${data.city}</td>
    </tr>
    <tr>
      <td>Country</td>
      <td>${data.country}</td>
    </tr>
    <tr>
      <td>Country Code</td>
      <td>${data.countryCode}</td>
    </tr>
    <tr>
      <td>ISP</td>
      <td>${data.isp}</td>
    </tr>
    <tr>
      <td>Latitude</td>
      <td>${data.lat}</td>
    </tr>
    <tr>
      <td>Longitude</td>
      <td>${data.lon}</td>
    </tr>
    <tr>
      <td>IP ADDRESS</td>
      <td>${data.query}</td>
    </tr>
    <tr>
      <td>Region</td>
      <td>${data.region}</td>
    </tr>
    <tr>
      <td>Region Name</td>
      <td>${data.regionName}</td>
    </tr>
    <tr>
      <td>Timezone</td>
      <td>${data.timezone}</td>
    </tr>
    <tr>
      <td>Zip</td>
      <td>${data.zip}</td>
    </tr>
  </table>`
}

function displayInvalidInput() {
    const h3 = document.createElement('h3');
    h3.className = 'error-message'
    h3.innerHTML = 'Input field empty!';
    greetingContainer.appendChild(h3);

    setTimeout(() => {
      const errorMsg = document.querySelector('.error-message');
      errorMsg.remove();
    },2000)
}

function displayFarewell(user) {
    const h3 = document.createElement('h3');
    h3.className = 'greeting'
    h3.innerHTML = `Have a great day <span class="username">${user}</span>!`
    greetingContainer.innerHTML = "";
    greetingContainer.appendChild(h3)
    setTimeout(() => {
        const farewell = document.querySelector('.greeting');
        farewell.remove();
      },2000)
      geolocInfo.innerHTML = "";
      document.body.classList.remove('after');
      
}


