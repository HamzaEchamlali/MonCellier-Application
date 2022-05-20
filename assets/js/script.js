//AFFICHAGE DE TOUT LES VINS
let wines;
window.onload = function () {
	//Récupérer tous les vins
	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines')
		.then(response => response.json())
		.then(function (json) {

			wines = json;

			//RECUPERER TOUTES LES ANNEES
			let str = '<option>All years</option>';
			const years = [];

			for (let wine of wines) {
				years.push(wine.year);
			}

			//Trier
			let yearTri = years.sort();

			//Supprimer les doublons
			let yearTri_sans_doublons = Array.from(new Set(yearTri));

			for (let year of yearTri_sans_doublons) {
				str += '<option>' + year + '</option>';
			}

			document.getElementById('yearSelect').innerHTML = str;


			//RECUPERER TOUT LES PAYS
			str = '<option>All countries</option>';
			const countries = [];

			for (let wine of wines) {
				countries.push(wine.country);
			}

			//Trier
			let countryTri = countries.sort();

			//Supprimer les doublons
			let countryTri_sans_doublons = Array.from(new Set(countryTri));

			for (let country of countryTri_sans_doublons) {
				str += '<option>' + country + '</option>';
			}

			document.getElementById('countrySelect').innerHTML = str;


			//RECUPERER TOUT LES VINS
			str = '';

			for (let wine of wines) {

				str += '<li data-id="' + wine.id + '">' + wine.name + '</li>';
			}

			document.getElementById('liste_wine').innerHTML = str;

			const allLi = document.querySelectorAll("#liste_wine li");

			for (let li of allLi) {
				li.onclick = function () {
					clickWine(this.dataset.id);
				}
			}
		})
}


function recherche() {
	let idVinChoisi;
	for (let wine of wines) {
		if (wine.name.toLowerCase() == document.getElementById("motClef").value.toLowerCase()) {
			document.getElementById("name").innerHTML = wine.name;
			document.getElementById("price").innerHTML = wine.price;
			document.getElementById("color").innerHTML = wine.color;
			document.getElementById("country").innerHTML = wine.country;
			document.getElementById("grapes").innerHTML = wine.grapes;
			document.getElementById("vinId").innerHTML = "#" + wine.id;
			document.getElementById("region").innerHTML = wine.region;
			document.getElementById("year").innerHTML = wine.year;
			document.getElementById("capacity").innerHTML = wine.capacity + " cl";
			document.getElementById("description").innerHTML = wine.description;
			document.getElementById("picture").setAttribute("style", "background: url(assets/pics/" + wine.picture + ") center no-repeat;");
			idVinChoisi = wine.id;
		}
	}

	let like = 0;
	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/likes-count')
		.then(response => response.json())
		.then(function (json) {
			like = json;
			nbLike = like.total;
			document.getElementById("nbLike").innerHTML = " " + '<span id="' + idVinChoisi + '" onclick="like(' + idVinChoisi + ');">' + nbLike + '</span>';
			document.getElementById("dislike").innerHTML = '<span id="' + idVinChoisi + '" onclick="dislike(' + idVinChoisi + ');"> Dislike </span>';
		})
}

function filtre() {
	//PARTIE PAYS SEULEMENT
	let countryChoose = "";
	let select = document.getElementById("countrySelect");
	for (let i = 0; i < select.length; i++) {
		if (select.options[i].selected == true && select.options[i].innerHTML != "All countries") {
			countryChoose = select.options[i].value;
		}
	}

	let yearChoose = "";
	let selectYear = document.getElementById("yearSelect");
	for (let i = 0; i < selectYear.length; i++) {
		if (selectYear.options[i].selected == true && selectYear.options[i].innerHTML != "All years") {
			yearChoose = selectYear.options[i].value;
		}
	}

	if (countryChoose.length > 0 && yearChoose.length == 0) {

		str = '';

		for (let wine of wines) {
			if (wine.country == countryChoose)
				str += '<li data-id="' + wine.id + '">' + wine.name + '</li>';
		}
		document.getElementById('liste_wine').innerHTML = str;

		const allLi = document.querySelectorAll("#liste_wine li");

		for (let li of allLi) {
			li.onclick = function () {
				clickWine(this.dataset.id);
			}
		}
	} else if (yearChoose.length > 0 && countryChoose.length == 0) {
		str = '';

		for (let wine of wines) {
			if (wine.year == yearChoose)
				str += '<li data-id="' + wine.id + '">' + wine.name + '</li>';
		}
		document.getElementById('liste_wine').innerHTML = str;

		const allLi = document.querySelectorAll("#liste_wine li");

		for (let li of allLi) {
			li.onclick = function () {
				clickWine(this.dataset.id);
			}
		}
	} else if (yearChoose.length > 0 && countryChoose.length > 0) {
		str = '';

		for (let wine of wines) {
			if (wine.year == yearChoose && wine.country == countryChoose)
				str += '<li data-id="' + wine.id + '">' + wine.name + '</li>';
		}
		document.getElementById('liste_wine').innerHTML = str;

		const allLi = document.querySelectorAll("#liste_wine li");

		for (let li of allLi) {
			li.onclick = function () {
				clickWine(this.dataset.id);
			}
		}
	} else if (yearChoose.length == 0 && countryChoose.length == 0) {
		str = '';

		for (let wine of wines) {

			str += '<li data-id="' + wine.id + '">' + wine.name + '</li>';
		}

		document.getElementById('liste_wine').innerHTML = str;

		const allLi = document.querySelectorAll("#liste_wine li");

		for (let li of allLi) {
			li.onclick = function () {
				clickWine(this.dataset.id);
			}
		}
	}
}

//DETAIL D'UN SEUL VIN
function clickWine(idVinChoisi) {


	for (let i = 0; i < wines.length; i++) {

		if (idVinChoisi == wines[i].id) {
			document.getElementById("name").innerHTML = wines[i].name;
			document.getElementById("price").innerHTML = wines[i].price;
			document.getElementById("color").innerHTML = wines[i].color;
			document.getElementById("country").innerHTML = wines[i].country;
			document.getElementById("grapes").innerHTML = wines[i].grapes;
			document.getElementById("vinId").innerHTML = "#" + wines[i].id;
			document.getElementById("region").innerHTML = wines[i].region;
			document.getElementById("year").innerHTML = wines[i].year;
			document.getElementById("capacity").innerHTML = wines[i].capacity + " cl";
			document.getElementById("description").innerHTML = wines[i].description;
			document.getElementById("picture").setAttribute("style", "background: url(assets/pics/" + wines[i].picture + ") center no-repeat;");

			//document.getElementById("extra").innerHTML = wines[i].extra;

		}
	}

	//AFFICHER LE NOMBRE DE LIKE

	let like = 0;
	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/likes-count')
		.then(response => response.json())
		.then(function (json) {
			like = json;
			nbLike = like.total;
			document.getElementById("nbLike").innerHTML = " " + '<span id="' + idVinChoisi + '" onclick="like(' + idVinChoisi + ');">' + nbLike + '</span>';
			document.getElementById("dislike").innerHTML = '<span id="' + idVinChoisi + '" onclick="dislike(' + idVinChoisi + ');"> Dislike </span>';
		})
}

function like(id) {
	//PREPARE LA MODIFICATION

	const wineId = id;	//Try with other id value
	const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	const options = {
		'method': 'PUT',
		'body': JSON.stringify({ "like": true }),	//Try with true or false
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}
	};

	//EXECUTE LA MODIFICATION
	const fetchURL = '/wines/' + wineId + '/like';
	fetch(apiURL + fetchURL, options).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				let like = 0;
				fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + id + '/likes-count')
					.then(response => response.json())
					.then(function (json) {
						like = json;
						nbLike = like.total;
						document.getElementById("nbLike").innerHTML = " " + '<span id="' + id + '" onclick="like(' + id + ');">' + nbLike + '</span>';
					})
			});
		} else {
			alert("ERROR");
		}
	});



}

function dislike(id) {

	//PREPARE LA MODIFICATION

	const wineId = id;	//Try with other id value
	const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	const options = {
		'method': 'PUT',
		'body': JSON.stringify({ "like": false }),	//Try with true or false
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}
	};

	//EXECUTE LA MODIFICATION
	const fetchURL = '/wines/' + wineId + '/like';
	fetch(apiURL + fetchURL, options).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				let like = 0;
				fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + id + '/likes-count')
					.then(response => response.json())
					.then(function (json) {
						like = json;
						nbLike = like.total;
						document.getElementById("nbLike").innerHTML = " " + '<span id="' + id + '" onclick="like(' + id + ');">' + nbLike + '</span>';
					})
			});
		} else {
			alert("ERROR");
		}
	});

}



//PREPARE LA MODIFICATION

/*
	const wineId = 10;	//Try with other id value
	const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	const options = {
		'method': 'PUT',
		'body': JSON.stringify({ "like" : true }),	//Try with true or false
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic '+btoa('ced:123')	//Try with other credentials (login:password)
		}
	};
    
//EXECUTE LA MODIFICATION
const fetchURL = '/wines/'+wineId+'/like';
	fetch(apiURL + fetchURL, options).then(function(response) {
		if(response.ok) {
			response.json().then(function(data){
				console.log(data);
			});
		}else{
			console.log("ERROR");
		}
	});
	*/


