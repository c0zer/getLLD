//Beautified code, use this instead?
let url = new URL("http://api.svenskakyrkan.se/platser/v3/place?apikey=70171abf-9a81-41dc-86c8-92be4675a501");
let params = new URLSearchParams(url.search);

//Remove redirecting when submit-button is clicked
var form = document.getElementById("coordinates");

function handleForm(event) {
	event.preventDefault();
}
form.addEventListener('submit', handleForm);

//fetch to localhost for json-response with all LKF + LLD's
function getPlatser() {

	fetch('http://localhost:2020/')
		.then(response => response.json())
		.then(data => {
			let platser = data;
			let LLD = platser[0].LLD
			let LKF = document.getElementById("LKFvalue").innerText

			for (const plats of platser) {
				if (plats.LKF == LKF)
					document.getElementById("LLDvalue").innerHTML = plats.LLD;
			}
		})
}

//fetch to svenskakyrkan api to get LKF from coordinates given as query params
function getPlaceInfo() {

	fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'x-requested-with': 'XMLHttpRequest'
		}
	})

	.then(response => response.json())
		.then(data => {
			let LKF = data.Results[0].AdmInfoSe.LkfInfo[0].Lkf
			document.getElementById("LKFvalue").innerHTML = LKF;
		})
		.catch(err => alert(err + '\nTesta att höja radius och anropa igen'));
}

//Set value of input fields
function setInputValue() {
	let long = document.getElementById("long").value;
	document.getElementById("long").innerHTML = long;
	let lat = document.getElementById("lat").value;
	document.getElementById("lat").innerHTML = lat;
	let radius = document.getElementById("radius").value;
	document.getElementById("radius").innerHTML = radius;
}

//Set query parameters from input field values
function setQueryParams() {
	params.set('nearby', document.getElementById("long").value + ',' + document.getElementById("lat").value); //longitud + latitud
	params.append('nearbyRadius', document.getElementById("radius").value); // radius, default 2000 (2km)
	url.search = params.toString();
	let new_url = url.toString();
	params.delete('nearbyRadius')
}

//Maps API
function initMap() {
	const myLatlng = {
		lat: 62.393639,
		lng: 17.312222
	};
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 8,
		center: myLatlng,
	});
	// Create the initial InfoWindow.
	let infoWindow = new google.maps.InfoWindow({
		content: "Klicka på kartan för att få koordinater!",
		position: myLatlng,
	});
	infoWindow.open(map);
	// Configure the click listener.
	map.addListener("click", (mapsMouseEvent) => {
		// Close the current InfoWindow.
		infoWindow.close();
		// Create a new InfoWindow.
		infoWindow = new google.maps.InfoWindow({
			position: mapsMouseEvent.latLng,
		});
		infoWindow.setContent(
			JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
		);
		infoWindow.open(map);
	});
}