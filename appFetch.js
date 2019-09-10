const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster= 'https://image.tmdb.org/t/p/w500';

function apiSeaech(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
     if(searchText.trim().length === 0){
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }
    movie.innerHTML = '<div class="spinner"></div>';
    fetch('https://api.themoviedb.org/3/search/multi?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru&query=' + searchText)
        .then((value) => {
            if(value.status !== 200){
                return Promise.reject(value);
            }
            return value.json();    
        })
        .then((output) => {
        let inner = '';
        if (output.results.length === 0) {
           inner = '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach((item) => {
            let nameItem = item.name || item.title;
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? urlPoster + item.poster_path : './img/noPoster.jpg';
            let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`; 
            if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`; 
            inner += `
                <div class="col-12 col-md-6 col-xl-3 item">
                    <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}/>
                    <h5>${nameItem}</h5> 
                </div>
            `;
        });
        movie.innerHTML = inner;

        addEventMedia()
        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error:' + reason.status);
        });
}
searchForm.addEventListener('submit',apiSeaech);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
        media.forEach((elem) => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}
    
function showFullInfo() {
    let url = '';
    if(this.dataset.type === 'movie'){
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru`
    } else if(this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru`
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Сори, ошибка! Повторите позже.</h2>';
    }

    

    fetch(url)
        .then((value) => {
            if(value.status !== 200){
                return Promise.reject(value);
            }
            return value.json();    
        })
        .then((output) => {
            console.dir(output)
            /*let genresName;
            output.genres.forEach((item) => {
                genresName += item.name + ', ';   
            });
            movie.innerHTML = genresName;
            
            <p>Жанр: ${genresName}</p>*/

            const poster = output.poster_path ? urlPoster + output.poster_path : './img/noPoster.jpg';
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-4">
                <img src='${poster}' alt='${output.name || output.title}'>
                ${(output.homepage) ? `<p class='text-center'><a href="${output.homepage}" target="blank">Официальная страница</a></p>` : ''}
                ${(output.imdb_id) ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target="blank">Страница на IMDB.com</a></p>` : ''}
            </div>
            <div class="col-8">
                <p>Рейтинг: ${output.vote_average}</p>
                <p>Статус: ${output.status}</p>
                <p>Примьера: ${output.release_date || output.first_air_date}</p>

                ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} Сезон ${output.last_episode_to_air.episode_number} Серий вышло</p>` : ''}
                
                <p>Описание: ${output.overview}</p>

                <br>
                <div class='youtube'></div>

            </div>
            `;

        getVideo(this.dataset.type, this.dataset.id);
        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error:' + reason.status);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru')
    .then((value) => {
        if(value.status !== 200){
            return Promise.reject(value);
        }
            return value.json();    
        })
    .then((output) => {
    let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
        if (output.results.length === 0) {
           inner = '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
    }
    output.results.forEach((item) => {
        let nameItem = item.name || item.title;
        let mediaType = item.title ? 'movie' : 'tv';
        const poster = item.poster_path ? urlPoster + item.poster_path : './img/noPoster.jpg';
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;  
        inner += `
            <div class="col-12 col-md-6 col-xl-3 item">
                <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}/>
                <h5>${nameItem}</h5> 
            </div>
        `;
    });
    movie.innerHTML = inner;

    addEventMedia()
    })
    .catch((reason) => {
        movie.innerHTML = 'Упс, что-то пошло не так!';
        console.error('error:' + reason.status);
    });
});

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=0c821d033847a4b7822d39dba5afb5e5&language=ru`)
    
        .then((value) => {
            if(value.status !== 200){
                return Promise.reject(value);
            }
                return value.json();    
            })
            .then((output)=> {
                console.dir(output)
                let videoFrame = '<h5 class="text-info">Трейлеры:</h5>';
                 if(output.results.length === 0) {
                    videoFrame = '<p>К сожалению Видео/Трейлер отсутствует</p>';
                 }
                output.results.forEach((item) => {
                    videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                })
                youtube.innerHTML = videoFrame;
            })
            .catch((reason) => {
                youtube.innerHTML = 'Трейлер отсутствует!';
                console.error('error:' + reason.status);
            })

    youtube.innerHTML = type;
}
