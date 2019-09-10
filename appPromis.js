const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSeaech(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';
    requestApi(server)
    .then((result) => {
        const output = JSON.parse(result);
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
    })
    .catch((reason) => {
        movie.innerHTML = 'Упс, что-то пошло не так!';
        console.error('error:' + reason.status);
        return;
    });
    ;
};
searchForm.addEventListener('submit',apiSeaech);

function requestApi(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);

        request.addEventListener('load', () => {
            if(request.status !== 200){
                reject({status: request.status});
                return;
            }
            resolve(request.response);
        });
        request.addEventListener('error', () => {
            reject({status: request.status});
        });
        request.send();
    });
}    