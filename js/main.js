// Recupero elementi dal DOM
const newsList = document.getElementById('news-list');
const loadMoreBtn = document.getElementById('load-more');

// Variabili per gestire news e paginazione
let newsIds = [];
let currentIndex = 0;
const newsPerPage = 10;

// Conversione in data leggibile
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

// Creazione dell'elemento <li> con titolo e data della news

function createNewsElement(news){
    const li = document.createElement('li');
    const title = document.createElement('a');
    title.target = "_blank";
    title.href = news.url || '#'
    title.textContent = news.title

    const date = document.createElement('span');
    date.textContent = " — " + formatDate(news.time);

    li.appendChild(title);
    li.appendChild(date);
    return li;
}

// Caricamento del blocco di news
function loadNews (){
    const idsToLoad = newsIds.slice(currentIndex, currentIndex + newsPerPage);
 
    const fetchPromises = idsToLoad.map(id => 
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(response => response.json())
    .catch(e => { 
        console.log(e);

    return null;
    })
 );


Promise.all(fetchPromises).then(result =>{
    result.forEach(news => {
        if (news) {
            const newsItem = createNewsElement(news);
            newsList.appendChild(newsItem);
        }
    });

    currentIndex += newsPerPage; //aggiornamento dell'index per avere piu news

    //Nascondo il pulsante se non ci sono più news
    if (currentIndex >= newsIds.length){
        loadMoreBtn.style.display = 'none';
    }
});
}

//Recupero la lista degli ID e avvio il caricamento
function init() {
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
    .then(response => response.json())
    .then(ids => {
        newsIds = ids;
        return loadNews();
    })
    .catch(error => {
        console.error('Errore nel caricamento delle news:', error);
    });
}

//Event listener sul pulsande "Load More"
loadMoreBtn.addEventListener('click', loadNews);

//avvio dell'app
init();