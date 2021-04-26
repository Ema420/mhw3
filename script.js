const client_id = 'cFNKeIZlQd0';
const client_secret = 'I-5rBfZ5i3NHdZkuZzcfoW5UZm2521gcG2dO9akjafsR3VvQCwokIA';
const imgToken = '21281452-6f32f2389a4a5a2525bf01ace';

function addElement(json_event){
	const currentDiv = document.querySelector('.content');
	
	//Preferiti
	const favArticle = document.createElement('article');
	favArticle.className = 'hidden';
	const favText = document.createElement('h2');
	favText.textContent = 'Preferiti';
	currentDiv.appendChild(favArticle);
	favArticle.appendChild(favText);
	const newSection = document.createElement('section');
	favArticle.appendChild(newSection);
	newSection.className = 'preferiti';
	
	const contenuti = json_event.results;
	
	for (const content of contenuti){		
		console.log(content);
		const newDiv = document.createElement('div');
		newDiv.classList.add('hidden1');
		newDiv.id = contenuti.indexOf(content);
		const title = document.createElement('span');
		title.textContent = content.title;
		const favorite = document.createElement('img');
		favorite.src = 'rem.png';
		favorite.className = 'icon';
		const detButton = document.createElement('button');
		detButton.textContent = 'Mostra Dettagli';
		detButton.className = 'infop';
		const description = document.createElement('p');
		description.textContent = content.description;
		description.classList.add('hidden');
		if(content.description === ''){
			description.textContent = content.start + ' ' + content.country + ' ' + content.category;
		}
		const image = document.createElement('img');
		image.classList.add('imgEvent');
		image.id = contenuti.indexOf(content);
		
		const boxApi = document.createElement('span');
		boxApi.classList.add('hidden');
		boxApi.id = content.labels[0];
		
		//API Image
		fetch('https://pixabay.com/api/?key=' + imgToken + '&q=' + content.labels[0]).then(onResponse).then(onJson);
		
		newSection.appendChild(newDiv);
		newDiv.appendChild(title);
		title.appendChild(favorite);
		newDiv.appendChild(boxApi);
		boxApi.appendChild(image);
		newDiv.appendChild(detButton);
		newDiv.appendChild(description);
		
		favorite.addEventListener('click', removeFavorite);
		detButton.addEventListener('click', showDetails);
	}
	
	//Intestazione
	const newArticle= document.createElement('article');
	newArticle.id = 'elementi';
	const firstDiv = document.createElement('div');
	firstDiv.className = 'principle';
	const intestazione = document.createElement('h2');
	intestazione.textContent = 'Eventi presenti nel database';
	const textSearch = document.createElement('em');
	textSearch.textContent = 'Cerca  ';
	const search = document.createElement('input');
	currentDiv.appendChild(firstDiv);
	firstDiv.appendChild(intestazione);
	firstDiv.appendChild(textSearch);
	textSearch.appendChild(search);
	currentDiv.appendChild(newArticle);
	
	//Contenuti
	console.log(contenuti);
	
	
	for (const content of contenuti){		
		
		const newDiv = document.createElement('div');
		newDiv.classList.add('show');
		newDiv.id = contenuti.indexOf(content);
		const title = document.createElement('span');
		title.textContent = content.title;
		const favorite = document.createElement('img');
		favorite.src = 'add.png';
		favorite.className = 'icon';
		const detButton = document.createElement('button');
		detButton.textContent = 'Mostra Dettagli';
		detButton.className = 'info';
		const description = document.createElement('p');
		description.textContent = content.description;
		description.classList.add('details');
		description.id = contenuti.indexOf(content);
		if(content.description === ''){
			description.textContent = content.start + ' ' + content.country + ' ' + content.category;
		}
		const image = document.createElement('img');
		image.classList.add('imgEvent');
		image.id = contenuti.indexOf(content);
		

		const boxApi = document.createElement('span');
		boxApi.classList.add('hidden');
		boxApi.id = content.labels[0];
		
		
		
		//API
		fetch('https://pixabay.com/api/?key=' + imgToken + '&q=' + content.labels[0]).then(onResponse).then(onJson);	
		
		
		newArticle.appendChild(newDiv);
		newDiv.appendChild(title);
		title.appendChild(favorite);
		newDiv.appendChild(boxApi);
		boxApi.appendChild(image);
		newDiv.appendChild(detButton);
		newDiv.appendChild(description);
		
		favorite.addEventListener('click', addFavorite);
		detButton.addEventListener('click', showDetails);
		
	}
	
	
	//Eventi
	search.addEventListener('keyup', searchContent);
}

function onJson(json){
	const x = Math.floor(Math.random()*(10-0)+0);
	const imgBoxes = document.querySelectorAll('#elementi .hidden');
	const favBoxes = document.querySelectorAll('.preferiti .hidden');

	for (box of imgBoxes){
		console.log(box.textContent);
		const str = json.hits[Math.floor(Math.random()*(10-0)+0)].previewURL;
		if(str.includes(box.textContent.toLowerCase())){
			box.firstElementChild.src = json.hits[Math.floor(Math.random()*(10-0)+0)].previewURL;
			console.log(box.firstElementChild.src);
			box.classList.remove('hidden');
			for(fav of favBoxes){
				if(box.parentElement.id === fav.parentElement.id){
					console.log(fav.parentElement.id);
					fav.firstElementChild.src = box.firstElementChild.src;
					fav.classList.remove('hidden');
				}
			}
		}
		
	}
}


fetch('https://auth.predicthq.com/token',
		{
			method: 'post',
			body: 'grant_type=client_credentials&scope=events',
			headers: {
				'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	).then(onResponse).then(getToken);
	
function getToken(json){
	token_data = json;
	console.log(token_data);
	fetch('https://api.predicthq.com/v1/events/',
		{	method: 'get',
			headers: {
				'Authorization': 'Bearer ' + json.access_token
			}
		}
	).then(onResponse).then(addElement);
}

function onTokenResponse(response){
	return response.json();
}

function onResponse(response){
	return response.json();
}

function addFavorite(event){
	const element = event.currentTarget;
	const fav = document.getElementById(element.parentNode.parentNode.id);
	const favArticle = document.querySelector('.hidden');
	if (favArticle.className === 'hidden'){
		favArticle.id = 'fav';
	}
	fav.classList.remove('hidden1');
	fav.classList.add('show');
}

function removeFavorite(event){
	const element = event.currentTarget;
	const fav = document.getElementById(element.parentNode.parentNode.id);
	const favArticle = document.querySelector('.hidden');
	if (favArticle.className === 'hidden'){
		favArticle.id = 'fav';
	}
	fav.classList.remove('show');
	fav.classList.add('hidden1');
	
	//Rimozione Barra Preferiti
	const checks = document.querySelectorAll('.preferiti div');
	let i = 0;
	for (const check of checks) {
		if (check.className === 'hidden1') {
			i++;
		}
	}
	if (i === checks.length) {
		favArticle.removeAttribute('id');
	}
}

function showDetails(event){
	const boxDetail = event.currentTarget;
	if (boxDetail.textContent === 'Mostra Dettagli'){
		boxDetail.textContent = 'Nascondi Dettagli';
	} else {
		boxDetail.textContent = 'Mostra Dettagli';
	}
	
	if(boxDetail.className === 'info'){
		const detail = document.querySelectorAll('.details');
		for (const det of detail){
			if (det.id === boxDetail.parentNode.id){
				det.classList.remove('details');
				det.classList.add('show1');
			}
		}
	} else {
		const detail = document.querySelectorAll('.hidden p');
		for (const det of detail){
			if (det.parentNode.id === boxDetail.parentNode.id){
				det.classList.remove('hidden');
				det.classList.add('show1');
			}
		}
	}
	event.currentTarget.addEventListener('click', hideDetails);
	event.currentTarget.removeEventListener('click', showDetails);
}

function hideDetails(event){
	const boxDetail = event.currentTarget;
	if (boxDetail.textContent === 'Nascondi Dettagli'){
		boxDetail.textContent = 'Mostra Dettagli';
	} else {
		boxDetail.textContent = 'Nascondi Dettagli';
	}
	
	if(boxDetail.className === 'info'){
		const detail = document.querySelectorAll('.show1');
		for (const det of detail){
			if (det.id === boxDetail.parentNode.id){
				det.classList.remove('show1');
				det.classList.add('details');
			}
		}
	} else {
		const detail = document.querySelectorAll('.hidden p');
		for (const det of detail){
			if (det.parentNode.id === boxDetail.parentNode.id){
				det.classList.remove('show1');
				det.classList.add('hidden');
			}
		}
	}
	event.currentTarget.addEventListener('click', showDetails);
	event.currentTarget.removeEventListener('click', hideDetails);
}


function searchContent(event){
	const inputValue = document.querySelector('input').value.toUpperCase();
	const contents = document.querySelectorAll('#elementi span');
	
	for (const content of contents) {
		const temp = content.textContent.toUpperCase();
		for ( let i = 0; i<temp.length; i++) {
			if (temp.includes(inputValue)){
				content.parentNode.classList.add('show');
				content.parentNode.classList.remove('hidden');
			} else {
				content.parentNode.classList.remove('show');
				content.parentNode.classList.add('hidden');
			}
		}
	}
}


