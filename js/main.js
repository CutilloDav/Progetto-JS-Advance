const newsList = document.getElementById('news-list');
const loadMoreBtn = document.getElementById('load-more');

let newsIds = [];
let currentIndex = 0;
const newsPerPage = 10;

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

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

    currentIndex += newsPerPage;

    if (currentIndex >= newsIds.length){
        loadMoreBtn.style.display = 'none';
    }
});
}

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

loadMoreBtn.addEventListener('click', loadNews);

init();