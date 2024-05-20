let artistesIsotope; // Mueve la definición de artistesIsotope a un ámbito superior

function procesarArtistas() {
    if (document.querySelector('.artistes-container').children.length > 0) {
        // Si los artistas ya se han cargado, resuelve la promesa inmediatamente
        return Promise.resolve();
    }
    // Devuelve una promesa que se resuelve cuando se han cargado todos los artistas
    return new Promise((resolve, reject) => {
        fetch('https://www.balearwave.com/assets/data/events.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el JSON: ' + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                // Obtener el contenedor donde se agregarán los elementos
                var contenedor = document.querySelector('.artistes-container');

                contenedor.style.height = 'auto';

                // Iterar sobre cada artista en el JSON y crear la estructura HTML
                data.musicData.artists.forEach(function(artist) {
                    // Crear div principal
                    var divItem = document.createElement('div');

                    // Establecer className en función de los datos del artista
                    var genreClass = '';
                    if (artist.genre === 'pop') {
                        genreClass = 'filter-pop';
                    } else if (artist.genre === 'rock') {
                        genreClass = 'filter-rock';
                    }

                    var typeClass = '';
                    if (artist.type === 'solista') {
                        typeClass = 'filter-solistes';
                    } else if (artist.type === 'grupo') {
                        typeClass = 'filter-grups';
                    }

                    divItem.className = 'col-md-4 mb-4 ' + genreClass + ' ' + typeClass;

                    // Crear div para el icono
                    var iconBox = document.createElement('div');
                    iconBox.className = 'icon-box';

                    // Crear imagen del artista
                    var img = document.createElement('img');
                    img.src = artist.image;
                    img.className = 'card-img-top';
                    img.alt = artist.name;

                    // Crear div para el cuerpo de la tarjeta
                    var cardBody = document.createElement('div');
                    cardBody.className = 'card-body';

                    // Crear título del artista
                    var h5 = document.createElement('h5');
                    h5.className = 'card-title';
                    h5.textContent = artist.name;

                    // Crear párrafo para la descripción del artista
                    var p = document.createElement('p');
                    p.className = 'card-text';
                    p.textContent = artist.description;

                    // Crear botón para ver más detalles del artista
                    var a = document.createElement('a');
                    a.href = `artista.html?nombre=${encodeURIComponent(artist.name)}`;
                    a.className = 'btn btn-custom';
                    a.textContent = 'Veure més';

                    // Crear botón para añadir a favoritos
                    var favButton = document.createElement('button');
                    favButton.textContent = 'Añadir a favoritos';
                    favButton.addEventListener('click', function() {
                        // Guarda el nombre del artista en localStorage
                        localStorage.setItem(artist.name, true);
                        alert(`${artist.name} añadido a favoritos`);
                    });

                    // Agregar todos los elementos creados al div principal
                    cardBody.append(h5, p, a, favButton);
                    iconBox.append(img, cardBody);
                    divItem.appendChild(iconBox);
                    contenedor.appendChild(divItem);
                });

                resolve();
            })
            .catch(error => {
                reject('Hubo un error al cargar los artistas: ' + error);
            });
    });
}

procesarArtistas().then(() => {
    // Después de generar los artistas, emite un evento personalizado
    var event = new CustomEvent('artistasCargados');
    window.dispatchEvent(event);
}).catch(error => {
    console.error('Hubo un error al cargar los artistas: ', error);
});

/**
* asrtistes filtros
*/
window.addEventListener('load', () => {
    let artistesContainer = document.querySelector('.artistes-container');

    if (artistesContainer) {
        artistesIsotope = new Isotope(artistesContainer, {
            itemSelector: '.col-md-4', // Selecciona el contenedor de cada artista
            layoutMode: 'fitRows',
            filter: '*' // Muestra todos los elementos por defecto
        });

        artistesContainer.style.height = 'auto';

        let artistesFilters = document.querySelectorAll('#artistes-flters li');
        let genreFilters = document.querySelector('#genre-flters');

        let currentFilters = ['*', '*']; // Inicializa los filtros con "todos"

        artistesFilters.forEach((filter) => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                artistesFilters.forEach((el) => {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                currentFilters[0] = this.getAttribute('data-filter'); // Actualiza el filtro de artistas

                let finalFilter = currentFilters.filter(f => f !== '*').join(''); // Ignora el filtro "todos"
                finalFilter = finalFilter ? finalFilter : '*'; // Si no hay otros filtros, usa "todos"

                artistesIsotope.arrange({
                    filter: finalFilter // Aplica el filtro final
                });
            });
        });

        genreFilters.addEventListener('change', function(e) {
            currentFilters[1] = this.value; // Actualiza el filtro de género

            let finalFilter = currentFilters.filter(f => f !== '*').join(''); // Ignora el filtro "todos"
            finalFilter = finalFilter ? finalFilter : '*'; // Si no hay otros filtros, usa "todos"

            artistesIsotope.arrange({
                filter: finalFilter // Aplica el filtro final
            });
        });

        // Añadir funcionalidad para mostrar favoritos
        document.getElementById('favoritos-filter').addEventListener('click', function() {
            let favoritos = Object.keys(localStorage);
            artistesIsotope.arrange({
                filter: function(itemElem) {
                    let name = itemElem.querySelector('.card-title').textContent;
                    return favoritos.includes(name);
                }
            });
        });
    }
});
