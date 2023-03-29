let url = 'http://localhost:3000/movies'
let featuredMovie = {};

let movieList = document.querySelector('#movie-list');
let detailImage = document.querySelector('#detail-image');
let title = document.querySelector('#title');
let yearReleased = document.querySelector('#year-released');
let movieDescription = document.querySelector('#description');
let bloodAmount = document.querySelector('#amount');
let watchedButton = document.querySelector('#watched');
let bloodForm = document.querySelector('#blood-form');
let bloodAmountInput = document.querySelector('#blood-amount');

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        featuredMovie = data[0];
        renderMovies(data);
        renderMovieDetails(featuredMovie);
    });

function renderMovies(movies) {

    movies.forEach((movie) => {

        let movieImage = document.createElement('img');
        movieImage.src = movie.image;

        movieList.append(movieImage);

        // when movie is clicked, display details
        movieImage.addEventListener('click', () => {
            featuredMovie = movie;
            renderMovieDetails(movie);
        });

        
    });
};

function renderMovieDetails(movieObj) {
    detailImage.src = movieObj.image;
    title.textContent = movieObj.title;
    yearReleased.textContent = movieObj.release_year;
    movieDescription.textContent = movieObj.description;
    bloodAmount.textContent = movieObj.blood_amount;
    buttonText(movieObj);
};

function buttonText(movieObj) {
    if (movieObj.watched === false) {
        watchedButton.textContent = 'Unwatched';
    } else {
        watchedButton.textContent = 'Watched';
    };
};

watchedButton.addEventListener('click', () => {

    // change status of watched in feature movie object
    featuredMovie.watched = !featuredMovie.watched;

    // patch new status of watched to db
    fetch(`${url}/${featuredMovie.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            watched: featuredMovie.watched,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        buttonText(data);
    })
});

bloodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let input = parseInt(e.target['blood-amount'].value);

    // only allow numbers to be input in form
    if (isNaN(parseInt(input))) {
        bloodAmountInput.value = '';
    } else {
        console.log(`adding more blood to ${featuredMovie.title}`);

        // take in input value
        // add to current featured movie's blood amount
        // reset featured movie's blood amount in db
        // update DOM with new amount
        
        featuredMovie.blood_amount = input + featuredMovie.blood_amount;

        fetch(`${url}/${featuredMovie.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                blood_amount: featuredMovie.blood_amount,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            bloodAmount.textContent = data.blood_amount;
            bloodAmountInput.value = '';

        });
    };
});

