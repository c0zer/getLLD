let url = new URL("https://api.svenskakyrkan.se/platser/v3/place?apikey=70171abf-9a81-41dc-86c8-92be4675a501");
let url2 = new URL("https://lldserver.herokuapp.com/");
let localurl = new URL("http://localhost:2020");
let params = new URLSearchParams(url.search);

let radius = 1000;
document.getElementById("radius").value = radius;

//Remove redirecting when submit-button is clicked
var form = document.getElementById("coordinates");

function handleForm(event) {
	event.preventDefault();
}
form.addEventListener('submit', handleForm);

//fetch to server for json-response with all place info
function getPlatser() {

	fetch(url2)
		.then(response => response.json())
		.then(data => {
			let platser = data;
			let LKF = document.getElementById("LKFvalue").value;
			for (const plats of platser) {
				if (plats.LKF == LKF)
					document.getElementById("LLDvalue").value = plats.LLD + ', ' + plats.Distrikt;
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
			let Kommun = data.Results[0].AdmInfoSe.LkfInfo[0].KommunNamn
			document.getElementById("LKFvalue").value = LKF;
			getPlatser();
		})
		.catch(function() {
			incrementRadius();
			setInputValue();
			setQueryParams();
			getPlaceInfo();
		});
}

function incrementRadius() {
	let x = 1000;
	radius += x;
	document.getElementById("radius").value = radius;
}

//Set value of input fields
function setInputValue() {
	let long = document.getElementById("long").value;
	document.getElementById("long").innerHTML = long;
	let lat = document.getElementById("lat").value;
	document.getElementById("lat").innerHTML = lat;
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
		//Print to input fields
		let svar = mapsMouseEvent.latLng.toJSON();
		lat = svar.lat;
		lng = svar.lng;
		document.getElementById("lat").value = lat.toPrecision(8)
		document.getElementById("long").value = lng.toPrecision(8)

		//Reset radius
		radius = 1000;
		document.getElementById("radius").value = 1000;

		//Reset LKF and LLD
		document.getElementById("LKFvalue").value = null;
		document.getElementById("LLDvalue").value = null;

		infoWindow.open(map);
	});
}
