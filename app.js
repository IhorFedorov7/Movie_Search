const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSeaech(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru&query=' + searchText;
    requestApi(server);
};
searchForm.addEventListener('submit',apiSeaech);

function requestApi(url) {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.send();
    request.addEventListener('readystatechange', () => {
        if (request.readyState !==4) return;

        if(request.status !== 200){
            console.error('error:' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        let inner = '';
        
        output.results.forEach((item) => {
            let nameItem = item.name || item.title;
            let releaseDate = item.release_date || item.first_air_date;
            inner += `
            <div class="container">
                <div class="col-12">Фильм: ${nameItem}</div>
                <p>Выход: ${releaseDate}</p>
            </div>
            `
        });
        movie.innerHTML = inner;
    });
}