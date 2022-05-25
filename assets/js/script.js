//AFFICHAGE DE TOUT LES VINS
let wines;
window.onload = function () {

/*
		let user = "";
		//AFFICHER LES COMMENTAIRES	
		fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users')
			.then(response => response.json())
			.then(function (json) {
				user = json;
				console.log(user);
				for(let i = 0; i < user.length; i++){
					if(user[i].login == login ){
						alert("tu existe dans la liste");
					}else{
						alert("This login doesn't exist");
					}
				}

			})
*/

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

function authentification(){

login = prompt("Login : ");
password = prompt("password : ");
				//AUTHENTIFICATION	
				let auth = "";
				const options = {
					'method': 'GET',
					'mode': 'cors',
					'headers': {
						'content-type': 'application/json; charset=utf-8',
						'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
					}};
	
				fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
					.then(response => response.json())
					.then(function (json) {
						auth = json;
						if(auth.success){
							document.getElementById("session").innerHTML = auth.email;
							alert("Welcome to MonCellier");

						}else{
							alert("Invalid informations");
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
			document.getElementById("buttonCommentary").innerHTML = "<span id="+wine.id+" onclick='addCommentary(this.id);'>Comment</span>";
			document.getElementById("picture").setAttribute("style", "background: url(assets/pics/" + wine.picture + ") center no-repeat;");
			document.getElementById("noter").innerHTML = '<button class="btn btn-primary btn-sm" type="button" style="background: rgb(78,115,223);" onclick="addNote('+wine.id+')">Send</button>'
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

		//AFFICHER LES COMMENTAIRES		
	document.getElementById("abc").innerHTML = "";
	let comment = "";
	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/comments')
		.then(response => response.json())
		.then(function (json) {
			comment = json;
			console.log(comment);
			for(let i = 0; i < comment.length; i++){

				if(comment[i].user_id == 10){
					document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: rgb(78, 115, 223);'></i> " + comment[i].content + "</p> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' type='button' onclick='deleteCommentary("+comment[i].id+","+comment[i].wine_id+")'>  delete </button> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' type='button' onclick='modifyCommentary("+comment[i].id+","+comment[i].wine_id+")'>  modify </button> <hr>";
				}else{
					document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: silver;'></i> " + comment[i].content + "</p> <hr>";
				}
			}	
		})

	//AFFICHER LES NOTES	
	document.getElementById("def").innerHTML = "";
	let notes = "";
	const options = {
		'method': 'GET',
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}};


	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/notes', options)
		.then(response => response.json())
		.then(function (json) {
			notes = json;
			if(notes.note.length > 0){
				document.getElementById("def").innerHTML = "<p>"+notes.note+"</p>"+"<button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' onclick='modifyNote("+idVinChoisi+")'> modify </button> " + " <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' onclick='deleteNote("+idVinChoisi+")'> Delete </button>";
			}
			
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
			document.getElementById("buttonCommentary").innerHTML = "<span id="+wines[i].id+" onclick='addCommentary(this.id);'>Comment</span>";
			document.getElementById("noter").innerHTML = '<button class="btn btn-primary btn-sm" type="button" style="background: rgb(78,115,223);" onclick="addNote('+wines[i].id+')">Send</button>'
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

	//AFFICHER LES COMMENTAIRES		
	document.getElementById("abc").innerHTML = "";
	let comment = "";
	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/comments')
		.then(response => response.json())
		.then(function (json) {
			comment = json;
			console.log(comment);
			for(let i = 0; i < comment.length; i++){

				if(comment[i].user_id == 10){
					document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: rgb(78, 115, 223);'></i> " + comment[i].content + "</p> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' type='button' onclick='deleteCommentary("+comment[i].id+","+comment[i].wine_id+")'>  delete </button> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' type='button' onclick='modifyCommentary("+comment[i].id+","+comment[i].wine_id+")'>  modify </button> <hr>";
				}else{
					document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: silver;'></i> " + comment[i].content + "</p> <hr>";
				}
			}	
		})

	//AFFICHER LES NOTES	
	document.getElementById("def").innerHTML = "";
	let notes = "";
	const options = {
		'method': 'GET',
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}};


	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/notes', options)
		.then(response => response.json())
		.then(function (json) {
			notes = json;
			if(notes.note.length > 0){
				document.getElementById("def").innerHTML = "<p>"+notes.note+"</p>"+"<button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' onclick='modifyNote("+idVinChoisi+")'> modify </button> " + " <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' onclick='deleteNote("+idVinChoisi+")'> Delete </button>";
			}
			
		})


	
	//AFFICHER LES IMAGES	
	let pictures = "";
	const optionss = {
		'method': 'GET',
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}};

		fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/pictures', optionss)
		.then(response => response.json())
		.then(function (json) {
			pictures = json;
			console.log(pictures);
			document.getElementById("buttPic").setAttribute("style", "background: url(" + pictures[0].url + ") center no-repeat;");
		})

}


function addPicture(){

		//AFFICHER LES IMAGES	
		let pictures = "";
		const options = {
			'method': 'POST',
			'body': JSON.stringify({ "FormData" : "test.jpg" }) ,	//La note
			'mode': 'cors',
			'headers': {
				//'content-type': 'application/json; charset=utf-8',
				'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
			}};
	
			fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + 10 + '/pictures', options)
			.then(response => response.json())
			.then(function (json) {
				pictures = json;
				console.log(pictures);
			})
	

}

function addNote(idVinChoisi){
	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
		let note = document.getElementById("signature").value;

		if(note.length > 0){

		//PREPARE LA MODIFICATION

		const wineId = idVinChoisi;	//Try with other id value
		const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
		const options = {
			'method': 'PUT',
			'body': JSON.stringify({ "note" : note }) ,	//La note
			'mode': 'cors',
			'headers': {
				'content-type': 'application/json; charset=utf-8',
				'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
			}
		};

		//EXECUTE LA MODIFICATION
		const fetchURL = '/wines/' + wineId + '/notes';
		fetch(apiURL + fetchURL, options).then(function (response) {
			if (response.ok) {
				alert("Note updated !");
					//AFFICHER LES NOTES	
	document.getElementById("def").innerHTML = "";
	let notes = "";
	const options = {
		'method': 'GET',
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}};


	fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/notes', options)
		.then(response => response.json())
		.then(function (json) {
			notes = json;
			console.log(notes.note);
			if(notes.note.length > 0){
				document.getElementById("def").innerHTML = "<p>"+notes.note+"</p>"+"<button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' onclick='modifyNote("+idVinChoisi+")'> modify </button> " + " <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' onclick='deleteNote("+idVinChoisi+")'> Delete </button>";
			}
		})
			} else {
				alert("ERROR");
			}
		});

	}else{
		alert("Note empty");
	}
							}else{
								alert('Invalid informations');
	
							}
						})
		
		document.getElementById("note_section").style.display='none';

}

function modifyNote(idVinChoisi){

	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
		let note = prompt("Modify your note :");

	if(note.length > 0){
	//PREPARE LA MODIFICATION

	const wineId = idVinChoisi;	//Try with other id value
	const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	const options = {
		'method': 'PUT',
		'body': JSON.stringify({ "note" : note }) ,	//La note
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}
	};

	//EXECUTE LA MODIFICATION
	const fetchURL = '/wines/' + wineId + '/notes';
	fetch(apiURL + fetchURL, options).then(function (response) {
		if (response.ok) {
			alert("Note updated !");
				//AFFICHER LES NOTES	
document.getElementById("def").innerHTML = "";
let notes = "";
const options = {
	'method': 'GET',
	'mode': 'cors',
	'headers': {
		'content-type': 'application/json; charset=utf-8',
		'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
	}};


fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/notes', options)
	.then(response => response.json())
	.then(function (json) {
		notes = json;
		console.log(notes.note);
		if(notes.note.length > 0){
			document.getElementById("def").innerHTML = "<p>"+notes.note+"</p>"+"<button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' onclick='modifyNote("+idVinChoisi+")'> modify </button> " + " <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' onclick='deleteNote("+idVinChoisi+")'> Delete </button>";
		}
	})
		} else {
			alert("ERROR");
		}
	});
	}else{
		alert("The new note is empty");
	}

							}else{
								alert('Invalid informations');
							}
						})


	document.getElementById("note_section").style.display='none';

}



function deleteNote(idVinChoisi){


	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
	let note = "";

	//PREPARE LA MODIFICATION

	const wineId = idVinChoisi;	//Try with other id value
	const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	const options = {
		'method': 'PUT',
		'body': JSON.stringify({ "note" : note }) ,	//La note
		'mode': 'cors',
		'headers': {
			'content-type': 'application/json; charset=utf-8',
			'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
		}
	};

	//EXECUTE LA MODIFICATION
	const fetchURL = '/wines/' + wineId + '/notes';
	fetch(apiURL + fetchURL, options).then(function (response) {
		if (response.ok) {
			alert("Note deleted !");
				//AFFICHER LES NOTES	
document.getElementById("def").innerHTML = "";
let notes = "";
const options = {
	'method': 'GET',
	'mode': 'cors',
	'headers': {
		'content-type': 'application/json; charset=utf-8',
		'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
	}};


fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/notes', options)
	.then(response => response.json())
	.then(function (json) {
		notes = json;
		console.log(notes.note);
		
		document.getElementById("def").innerHTML = notes.note;
	})
		} else {
			alert("ERROR");
		}
	});
							}else{
								alert('Invalid informations');
							}
						})




	
}

function addCommentary(idVinChoisi){

	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
		let commentaire = document.getElementById("myCommentary").value;

		if(commentaire.length>0){
	//PREPARE LA MODIFICATION

			const wineId = idVinChoisi;	//Try with other id value
			const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
			const options = {
				'method': 'POST',
				'body': JSON.stringify({ "content" : commentaire }) ,	//Le commentaire
				'mode': 'cors',
				'headers': {
					'content-type': 'application/json; charset=utf-8',
					'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
				}
			};

			//EXECUTE LA MODIFICATION
			const fetchURL = '/wines/' + wineId + '/comments';
			fetch(apiURL + fetchURL, options).then(function (response) {
				if (response.ok) {
					response.json().then(function (data) {
						alert("Your comment has been added");
						document.getElementById("abc").innerHTML = "";
						let comment = "";
						//AFFICHER LES COMMENTAIRES	
						fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/comments')
							.then(response => response.json())
							.then(function (json) {
								comment = json;
								for(let i = 0; i < comment.length; i++){
					
									if(comment[i].user_id == 10){
										document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: rgb(78, 115, 223);'></i> " + comment[i].content + "</p> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' type='button' onclick='deleteCommentary("+comment[i].id+","+comment[i].wine_id+")'>  delete </button> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' type='button' onclick='modifyCommentary("+comment[i].id+","+comment[i].wine_id+")'>  modify </button> <hr>";
									}else{
										document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: silver;'></i> " + comment[i].content + "</p> <hr>";
									}
					
								}	
							})
					});
				} else {
					alert("ERROR");
				}
			});

		}else{
			alert("Comment empty");
		}
							}else{
								alert('Invalid informations');
							}
						})
			document.getElementById("commentary_section").style.display='none';
}

function modifyCommentary(idCommentaire, idVinChoisi){

	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
	let commentaireModifier = prompt("Modify your commentary");

	if(commentaireModifier.length > 0){

	//PREPARE LA MODIFICATION

const wineId = idVinChoisi;	//Try with other id value
const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
const options = {
	'method': 'PUT',
	'body': JSON.stringify({ "content" : commentaireModifier }) ,	//Le commentaire
	'mode': 'cors',
	'headers': {
		'content-type': 'application/json; charset=utf-8',
		'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
	}
};

//EXECUTE LA MODIFICATION
const fetchURL = '/wines/' + wineId + '/comments/' + idCommentaire;
fetch(apiURL + fetchURL, options).then(function (response) {
	if (response.ok) {
		response.json().then(function (data) {
			alert("Your comment has been updated");
document.getElementById("abc").innerHTML = "";
let comment = "";
//AFFICHER LES COMMENTAIRES	
fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/comments')
	.then(response => response.json())
	.then(function (json) {
		comment = json;
		for(let i = 0; i < comment.length; i++){

			if(comment[i].user_id == 10){
				document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: rgb(78, 115, 223);'></i> " + comment[i].content + "</p> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' type='button' onclick='deleteCommentary("+comment[i].id+","+comment[i].wine_id+")'>  delete </button> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' type='button' onclick='modifyCommentary("+comment[i].id+","+comment[i].wine_id+")'>  modify </button> <hr>";
			}else{
				document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: silver;'></i> " + comment[i].content + "</p> <hr>";
			}

		}	
	})
		});
	} else {
		alert("ERROR");
	}
});

	}else{
		alert("The new comment is empty");
	}

							}else{
								alert('Invalid informations');
							}
						})

document.getElementById("commentary_section").style.display='none';
}

function deleteCommentary(idCommentaire, idVinChoisi){

	let login = prompt("Login :");
	let password = prompt("Password :");

					//AUTHENTIFICATION	
					let auth = "";
					const options = {
						'method': 'GET',
						'mode': 'cors',
						'headers': {
							'content-type': 'application/json; charset=utf-8',
							'Authorization': 'Basic ' + btoa(''+login+':'+password+'')	//Try with other credentials (login:password)
						}};
		
					fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate',options)
						.then(response => response.json())
						.then(function (json) {
							auth = json;
							if(auth.success){
								document.getElementById("session").innerHTML = auth.email;
	//PREPARE LA MODIFICATION

const wineId = idVinChoisi;	//Try with other id value
const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
const options = {
	'method': 'DELETE',
	'mode': 'cors',
	'headers': {
		'content-type': 'application/json; charset=utf-8',
		'Authorization': 'Basic ' + btoa('hamza:123')	//Try with other credentials (login:password)
	}
};

//EXECUTE LA MODIFICATION
const fetchURL = '/wines/' + wineId + '/comments/' + idCommentaire;
fetch(apiURL + fetchURL, options).then(function (response) {
	if (response.ok) {
		response.json().then(function (data) {
			alert("Your comment has been deleted");
document.getElementById("abc").innerHTML = "";
let comment = "";
//AFFICHER LES COMMENTAIRES	
fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + idVinChoisi + '/comments')
	.then(response => response.json())
	.then(function (json) {
		comment = json;
		for(let i = 0; i < comment.length; i++){

			if(comment[i].user_id == 10){
				document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: rgb(78, 115, 223);'></i> " + comment[i].content + "</p> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;background-color:red' type='button' onclick='deleteCommentary("+comment[i].id+","+comment[i].wine_id+")'>  delete </button> <button class='btn btn-primary btn-sm btn-icon-split' style='padding:1vh 1vw;' type='button' onclick='modifyCommentary("+comment[i].id+","+comment[i].wine_id+")'>  modify </button> <hr>";
			}else{
				document.getElementById("abc").innerHTML += "<p> <i class='fas fa-user' style='color: silver;'></i> " + comment[i].content + "</p> <hr>";
			}

		}	
	})
		});
	} else {
		alert("ERROR");
	}
});
							}else{
								alert('Invalid informations');
							}
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


