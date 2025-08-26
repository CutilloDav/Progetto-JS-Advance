import '../css/style.css';
import axios from 'axios';

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
function createNewsElement(news) {
    const li = document.createElement('li');
    const title = document.createElement('a');
    title.target = "_blank";
    title.href = news.url || '#';
    title.textContent = news.title;

    const date = document.createElement('span');
    date.textContent = " — " + formatDate(news.time);

    li.appendChild(title);
    li.appendChild(date);
    return li;
}

// Caricamento del blocco di news
async function loadNews() {
    const idsToLoad = newsIds.slice(currentIndex, currentIndex + newsPerPage);

    try {
        // Richieste multiple con axios
        const responses = await Promise.all(
            idsToLoad.map(id =>
                axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                    .then(res => res.data)
                    .catch(e => {
                        console.error(e);
                        return null;
                    })
            )
        );

        responses.forEach(news => {
            if (news) {
                const newsItem = createNewsElement(news);
                newsList.appendChild(newsItem);
            }
        });

        currentIndex += newsPerPage; // aggiornamento dell'indice

        // Nascondo il pulsante se non ci sono più news
        if (currentIndex >= newsIds.length) {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Errore durante il caricamento delle news:', error);
    }
}

// Recupero la lista degli ID e avvio il caricamento
async function init() {
    try {
        const response = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
        newsIds = response.data;
        loadNews();
    } catch (error) {
        console.error('Errore nel caricamento degli ID delle news:', error);
    }
}

// Event listener sul pulsante "Load More"
loadMoreBtn.addEventListener('click', loadNews);

// Avvio dell'app
init();
