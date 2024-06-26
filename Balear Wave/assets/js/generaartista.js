document.addEventListener('DOMContentLoaded', () => {
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
                        var artistType = artist.additionalProperty.value;
                        console.log(artistType)
                        if (artistType  === 'solista') {
                            typeClass = 'filter-solistes';
                        } else if (artistType  === 'grupo') {
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

                        // Crear contenedor para los botones
                        var btnContainer = document.createElement('div');
                        btnContainer.className = 'row btn-container';

                        // Crear botón para ver más detalles del artista
                        var a = document.createElement('a');
                        a.href = `artista.html?nombre=${encodeURIComponent(artist.name)}`;
                        a.className = 'btn btn-custom';
                        a.textContent = 'Veure més';

                        // Crear botón para añadir a favoritos
                        var favButton = document.createElement('button');
                        favButton.className = 'btn btn-fav ' + (localStorage.getItem(artist.name) ? 'btn-fav-added' : 'btn-fav-not-added');
                        favButton.textContent = localStorage.getItem(artist.name) ? 'Deixar de seguir' : 'Seguir';
                        favButton.addEventListener('click', function() {
                            if (localStorage.getItem(artist.name)) {
                                // Eliminar de favoritos
                                localStorage.removeItem(artist.name);
                                favButton.textContent = 'Seguir';
                                favButton.classList.remove('btn-fav-added');
                                favButton.classList.add('btn-fav-not-added');
                                alert(`${artist.name} deixat de seguir`);
                            } else {
                                // Añadir a favoritos
                                localStorage.setItem(artist.name, true);
                                favButton.textContent = 'Deixar de seguir';
                                favButton.classList.remove('btn-fav-not-added');
                                favButton.classList.add('btn-fav-added');
                                alert(`Has començat a seguir a ${artist.name}`);
                            }
                        });

                        // Agregar los botones al contenedor de botones
                        btnContainer.append(a, favButton);

                        // Agregar todos los elementos creados al div principal
                        cardBody.append(h5, p, btnContainer);
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

    function inicializarIsotope() {
    let artistesContainer = document.querySelector('.artistes-container');

    if (artistesContainer) {
        artistesIsotope = new Isotope(artistesContainer, {
            itemSelector: '.col-md-4', // Selecciona el contenedor de cada artista
            layoutMode: 'fitRows',
            filter: '*' // Establece el filtro inicial como "todos"
        });
    
        artistesContainer.style.height = '1700px'
    }
}


    function configurarFiltros() {
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

    procesarArtistas().then(() => {
        inicializarIsotope();
        configurarFiltros();
        // Después de inicializar Isotope y configurar filtros, emite un evento personalizado
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
            artistesContainer.style.height = 'auto';
        }
    });
});
