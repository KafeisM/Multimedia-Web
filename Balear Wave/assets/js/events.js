document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al botón de mapa
    var botonMapa = document.querySelector('#boton-mapa-events');

    // Obtener referencia al contenedor del mapa
    var mapaContainer = document.getElementById('mapa-events');

    // Agregar un event listener al botón de mapa
    botonMapa.addEventListener('click', function() {
        toggleMapVisibility();
    });

    // Función para alternar la visibilidad del mapa y obtener la geolocalización
    function toggleMapVisibility() {
        if (mapaContainer.style.display === 'none') {
            mapaContainer.style.display = 'block';
            obtenerGeolocalizacion(); // Obtener geolocalización y mostrar mapa al hacer clic
        } else {
            mapaContainer.style.display = 'none';
        }
    }

    // Función para obtener la geolocalización del usuario y mostrar el mapa
    function obtenerGeolocalizacion() {
        // Verificar si el navegador soporta geolocalización
        if (navigator.geolocation) {
            // Solicitar la ubicación del usuario
            navigator.geolocation.getCurrentPosition(function(position) {
                // Obtener las coordenadas de latitud y longitud
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Crear un mapa con Leaflet y establecer el centro en la ubicación obtenida
                var map = L.map('mapa-interno-events').setView([latitude, longitude], 10);

                // Agregar la capa de OpenStreetMap al mapa
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Agregar un marcador en la ubicación obtenida con un icono personalizado
                var ubicacionActualIcono = L.icon({
                    iconUrl: 'https://www.balearwave.com/assets/img/events/user-location.png', // Ruta a tu icono personalizado
                    iconSize: [32, 32], // Tamaño del icono
                    iconAnchor: [16, 32], // Punto de anclaje del icono
                    popupAnchor: [0, -32] // Punto donde se abrirá el popup del marcador
                });
                L.marker([latitude, longitude], { icon: ubicacionActualIcono }).addTo(map)
                    .bindPopup('Tu ubicación actual').openPopup();

                // Marcar ubicaciones de eventos en el mapa
                marcarUbicacionesEventos(map, latitude, longitude);
            }, function(error) {
                // Manejar errores de geolocalización
                console.error('Error obteniendo la ubicación:', error);
            });
        } else {
            console.error('Geolocalización no es compatible con este navegador');
        }
    }

    // Función para marcar ubicaciones de eventos en el mapa
    function marcarUbicacionesEventos(map, latitude, longitude) {
        // Iterar sobre cada evento y marcar su ubicación en el mapa
        todosLosEventos.forEach(function(evento) {
            // Obtener las coordenadas de latitud y longitud del lugar del evento
            obtenerCoordenadasLugar(evento.location.name, function(latitud, longitud) {
                // Verificar si se obtuvieron las coordenadas
                if (latitud !== null && longitud !== null) {
                    // Determinar si el evento está en la ubicación actual del usuario
                    if (latitud === latitude && longitud === longitude) {
                        // Usar el icono personalizado para la ubicación actual
                        var iconoEvento = ubicacionActualIcono;
                    } else {
                        // Usar un icono diferente para otros eventos
                        var iconoEvento = L.icon({
                            iconUrl: 'https://www.balearwave.com/assets/img/events/location.png', // Ruta a tu icono personalizado para eventos
                            iconSize: [32, 32], // Tamaño del icono
                            iconAnchor: [16, 32], // Punto de anclaje del icono
                            popupAnchor: [0, -32] // Punto donde se abrirá el popup del marcador
                        });
                    }
                    // Agregar un marcador en la ubicación del evento con el icono correspondiente
                    L.marker([latitud, longitud], { icon: iconoEvento }).addTo(map)
                        .bindPopup(evento.name).openPopup();
                } else {
                    console.log('No se encontraron coordenadas para', evento.location.name);
                }
            });
        });
    }

    // Variable global para almacenar todos los eventos
    var todosLosEventos = [];
    var favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; // Cargar favoritos desde localStorage

    // Función para generar la lista de eventos
    function generarListaEventos() {
        // Obtener el contenedor principal
        var contenedorPrincipal = document.getElementById('events-container');

        // Realizar la solicitud para obtener los datos del JSON
        fetch('https://www.balearwave.com/assets/data/events.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el JSON: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                // Obtener la lista de eventos del JSON
                todosLosEventos = data.musicData.events;

                // Mostrar todos los eventos inicialmente
                mostrarEventos(todosLosEventos, contenedorPrincipal);

                // Manejar el filtro por género
                manejarFiltroGenero(data);

                manejarFiltroPrecio();

                manejarFiltroFecha();

                manejarFiltroPorNombre();
            })
            .catch(error => {
                console.error('Error al cargar el JSON:', error);
            });
    }

    // Función para manejar el filtro de género
    function manejarFiltroGenero(data) {
        // Obtener el select del filtro de género
        var selectGenero = document.getElementById('genre-select');

        // Limpiar las opciones existentes en el select
        selectGenero.innerHTML = '';

        // Agregar la opción "Todos"
        var optionTodos = document.createElement('option');
        optionTodos.value = 'todos';
        optionTodos.textContent = 'Tots';
        selectGenero.appendChild(optionTodos);

        // Obtener la lista de artistas del JSON
        var artistas = data.musicData.artists;

        // Obtener todos los géneros musicales únicos
        var generosUnicos = [...new Set(artistas.map(artist => artist.genre))];

        // Crear opciones para cada género musical
        generosUnicos.forEach(function(genero) {
            var optionGenero = document.createElement('option');
            optionGenero.value = genero.toLowerCase(); // Convertir el género a minúsculas para comparación
            optionGenero.textContent = genero;
            selectGenero.appendChild(optionGenero);
        });

        // Agregar un event listener al select para filtrar los eventos al cambiar el género seleccionado
        selectGenero.addEventListener('change', function() {
            // Obtener el valor seleccionado del filtro de género
            var generoSeleccionado = selectGenero.value;

            console.log("Género seleccionado:", generoSeleccionado);

            // Filtrar los eventos basados en el género seleccionado
            var eventosFiltrados = todosLosEventos.filter(function(evento) {
                return artistas.some(function(artista) {
                    console.log("artista: ", artista.name);
                    console.log("genre real: ", artista.genre.toLowerCase());
                    console.log("genre comparado: ", generoSeleccionado);
                    console.log("::::::::::::::");
                    return artista.name === evento.performer[0].name && artista.genre.toLowerCase() === generoSeleccionado;
                });
            });

            // Mostrar solo los eventos filtrados
            mostrarEventos(eventosFiltrados, document.getElementById('events-container'));
        });
    }

    // Función para mostrar eventos en el contenedor principal
    function mostrarEventos(eventos, contenedorPrincipal) {
        // Limpiar los eventos anteriores
        contenedorPrincipal.innerHTML = '';

        // Iterar sobre cada evento y mostrarlo
        eventos.forEach(function(evento) {
            // Crear elemento div para el evento
            var divEvento = document.createElement('div');
            divEvento.classList.add('events-item');

            // Crear elemento imagen para el evento
            var imgEvento = document.createElement('img');
            imgEvento.src = evento.image;

            // Crear elemento div para el contenido del evento
            var divContenido = document.createElement('div');
            divContenido.classList.add('events-content');

            // Crear título del evento
            var tituloEvento = document.createElement('h3');
            tituloEvento.textContent = evento.name;

            // Crear lista para detalles del evento
            var listaDetalles = document.createElement('ul');

            // Crear elementos de detalles del evento
            var detalles = {
                "Data": new Date(evento.startDate).toLocaleDateString(),
                "Hora": new Date(evento.startDate).toLocaleTimeString(),
                "Preu": evento.offers.price + " " + evento.offers.priceCurrency,
                "Lloc": evento.location.name
            };

            // Agregar detalles del evento a la lista
            for (var key in detalles) {
                if (detalles.hasOwnProperty(key)) {
                    var li = document.createElement('li');
                    var strong = document.createElement('strong');
                    strong.textContent = key + ": ";
                    var span = document.createElement('span');
                    span.textContent = detalles[key];
                    li.appendChild(strong);
                    li.appendChild(span);
                    listaDetalles.appendChild(li);
                }
            }

            // Crear botón para obtener entradas
            var btnEntradas = document.createElement('button');
            btnEntradas.textContent = 'Entrades';
            btnEntradas.classList.add('btn', 'btn-custom');
            btnEntradas.addEventListener('click', function() {
                window.location.href = evento.offers.url;
            });

            // Crear botón para marcar como favorito
            var btnFavorito = document.createElement('button');
            btnFavorito.textContent = 'Favorito';
            btnFavorito.classList.add('btn-favorite');
            if (favoritos.some(fav => fav.name === evento.name)) {
                btnFavorito.classList.add('active');
            }
            btnFavorito.addEventListener('click', function() {
                toggleFavorito(evento, btnFavorito);
            });

            // Agregar elementos al contenido del evento
            divContenido.appendChild(tituloEvento);
            divContenido.appendChild(listaDetalles);
            divContenido.appendChild(btnEntradas);
            divContenido.appendChild(btnFavorito);

            // Agregar imagen y contenido al div del evento
            divEvento.appendChild(imgEvento);
            divEvento.appendChild(divContenido);

            // Agregar el evento al contenedor principal
            contenedorPrincipal.appendChild(divEvento);

            // Agregar un separador horizontal
            var hr = document.createElement('hr');
            contenedorPrincipal.appendChild(hr);
        });
    }

    // Función para manejar el filtro de precio
    function manejarFiltroPrecio() {
        // Obtener el select del filtro de precio
        var selectPrecio = document.getElementById('price-select');

        // Agregar un event listener al select para filtrar los eventos al cambiar el precio seleccionado
        selectPrecio.addEventListener('change', function() {
            // Obtener el valor seleccionado del filtro de precio
            var precioSeleccionado = selectPrecio.value;

            console.log("Precio seleccionado:", precioSeleccionado);

            // Filtrar los eventos basados en el precio seleccionado
            var eventosFiltrados = todosLosEventos.filter(function(evento) {
                if (precioSeleccionado === 'gratis') {
                    return evento.offers.price === 0;
                } else if (precioSeleccionado === 'menor20') {
                    return evento.offers.price < 20;
                } else if (precioSeleccionado === 'mayor20') {
                    return evento.offers.price >= 20;
                } else {
                    return true; // Mostrar todos los eventos si no se selecciona un precio específico
                }
            });

            // Mostrar solo los eventos filtrados
            mostrarEventos(eventosFiltrados, document.getElementById('events-container'));
        });
    }

    // Función para manejar el filtro de fecha
    function manejarFiltroFecha() {
        // Obtener los selectores de fecha
        var selectFechaInicio = document.getElementById('start-date-select');
        var selectFechaFin = document.getElementById('end-date-select');

        // Agregar event listeners a los selectores de fecha para filtrar los eventos al cambiar las fechas
        selectFechaInicio.addEventListener('change', filtrarPorFecha);
        selectFechaFin.addEventListener('change', filtrarPorFecha);
    }

    // Función para filtrar los eventos por fecha
    function filtrarPorFecha() {
        // Obtener los valores de las fechas seleccionadas
        var fechaInicioSeleccionada = new Date(document.getElementById('start-date-select').value);
        var fechaFinSeleccionada = new Date(document.getElementById('end-date-select').value);

        console.log("Fecha inicio seleccionada:", fechaInicioSeleccionada);
        console.log("Fecha fin seleccionada:", fechaFinSeleccionada);

        // Filtrar los eventos basados en las fechas seleccionadas
        var eventosFiltrados = todosLosEventos.filter(function(evento) {
            var fechaEvento = new Date(evento.startDate);
            return fechaEvento >= fechaInicioSeleccionada && fechaEvento <= fechaFinSeleccionada;
        });

        // Mostrar solo los eventos filtrados
        mostrarEventos(eventosFiltrados, document.getElementById('events-container'));
    }

    // Función para manejar el filtro por nombre
    function manejarFiltroPorNombre() {
        // Obtener el input del filtro de nombre
        var inputNombre = document.getElementById('search-input');

        // Agregar un event listener al input para filtrar los eventos al cambiar el valor del input
        inputNombre.addEventListener('input', function() {
            // Obtener el valor del input
            var nombreBuscado = inputNombre.value.toLowerCase();

            console.log("Nombre buscado:", nombreBuscado);

            // Filtrar los eventos basados en el nombre buscado
            var eventosFiltrados = todosLosEventos.filter(function(evento) {
                return evento.name.toLowerCase().includes(nombreBuscado);
            });

            // Mostrar solo los eventos filtrados
            mostrarEventos(eventosFiltrados, document.getElementById('events-container'));
        });
    }

    // Función para alternar el estado de favorito de un evento
    function toggleFavorito(evento, btn) {
        var index = favoritos.findIndex(fav => fav.name === evento.name);
        if (index > -1) {
            favoritos.splice(index, 1);
            btn.classList.remove('active');
        } else {
            favoritos.push(evento);
            btn.classList.add('active');
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    // Inicializar la lista de eventos
    generarListaEventos();

    // Obtener referencia al botón de favoritos
    var btnFavoritos = document.getElementById('favorites-filter');

    // Evento para mostrar solo favoritos
    btnFavoritos.addEventListener('click', function() {
        mostrarEventos(favoritos, document.getElementById('events-container'));
    });
});
