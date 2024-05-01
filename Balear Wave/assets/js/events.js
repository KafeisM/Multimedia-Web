document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al botón de mapa
    var botonMapa = document.querySelector('#events-filters-2');

    // Obtener referencia al contenedor del mapa
    var mapaContainer = document.getElementById('mapa');

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
                var map = L.map('mapa-interno').setView([latitude, longitude], 10);

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
});



// Variable global para almacenar todos los eventos
var todosLosEventos = [];

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
        .then(function (data) {
            // Obtener la lista de eventos del JSON
            todosLosEventos = data.musicData.events;

            // Mostrar todos los eventos inicialmente
            mostrarEventos(todosLosEventos, contenedorPrincipal);

            // Manejar el filtro por género
            manejarFiltroGenero(data);

            manejarFiltroPrecio();

            manejarFiltroFecha();

            manejarFiltroPorNombre()
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
    generosUnicos.forEach(function (genero) {
        var optionGenero = document.createElement('option');
        optionGenero.value = genero.toLowerCase(); // Convertir el género a minúsculas para comparación
        optionGenero.textContent = genero;
        selectGenero.appendChild(optionGenero);
    });

    // Agregar un event listener al select para filtrar los eventos al cambiar el género seleccionado
    selectGenero.addEventListener('change', function () {
        // Obtener el valor seleccionado del filtro de género
        var generoSeleccionado = selectGenero.value;
    
        console.log("Género seleccionado:", generoSeleccionado);
    
        // Filtrar los eventos basados en el género seleccionado
        // Filtrar los eventos basados en el género seleccionado
        var eventosFiltrados = todosLosEventos.filter(function (evento) {
           

            return artistas.some(function (artista) {
                console.log("artista: ", artista.name)
                console.log("genre real: ", artista.genre.toLowerCase());
                console.log("genre cmparat: ", generoSeleccionado);
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
    eventos.forEach(function (evento) {
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

        // Crear botón de entradas
        var btnEntradas = document.createElement('button');
        btnEntradas.textContent = 'Entrades';
        btnEntradas.classList.add('btn', 'btn-custom');
        btnEntradas.addEventListener('click', function () {
            window.location.href = evento.offers.url;
        });

        // Agregar elementos al div de contenido del evento
        divContenido.appendChild(tituloEvento);
        divContenido.appendChild(listaDetalles);
        divContenido.appendChild(btnEntradas);

        // Agregar elementos al div del evento
        divEvento.appendChild(imgEvento);
        divEvento.appendChild(divContenido);

        // Agregar evento al contenedor principal
        contenedorPrincipal.appendChild(divEvento);

        // Crear elemento hr para separar eventos
        var hr = document.createElement('hr');
        contenedorPrincipal.appendChild(hr);

    });
}

// Función para manejar el filtro por precio
function manejarFiltroPrecio() {
    // Obtener el elemento input del rango de precios
    var priceRange = document.getElementById('price-range');

    // Agregar un event listener para detectar cambios en el rango de precios
    priceRange.addEventListener('input', function () {
        // Obtener el valor actual del rango de precios
        var precioSeleccionado = parseFloat(priceRange.value);

        // Actualizar el valor del span que muestra el precio seleccionado
        document.getElementById('price-value').textContent = precioSeleccionado + '€';

        // Filtrar y mostrar los eventos nuevamente con el nuevo filtro de precio
        var generoSeleccionado = document.getElementById('genre-select').value;
        var eventosFiltradosPorPrecio = todosLosEventos.filter(function (evento) {
            return parseFloat(evento.offers.price) <= precioSeleccionado;
        });

        // Si hay un género seleccionado, aplicar también ese filtro
        if (generoSeleccionado !== 'todos') {
            eventosFiltradosPorPrecio = eventosFiltradosPorPrecio.filter(function (evento) {
                return evento.performer.some(function (artista) {
                    return artista.genre.toLowerCase() === generoSeleccionado;
                });
            });
        }

        // Mostrar solo los eventos filtrados por precio
        mostrarEventos(eventosFiltradosPorPrecio, document.getElementById('events-container'));
    });
}

// Función para manejar el filtro por fecha
function manejarFiltroFecha() {
    // Obtener el elemento input de la fecha
    var dateInput = document.getElementById('date-input');

    // Agregar un event listener para detectar cambios en la fecha
    dateInput.addEventListener('input', function () {
        if (dateInput.value === '') {
            // Si la fecha seleccionada está vacía, mostrar todos los eventos nuevamente
            mostrarEventos(todosLosEventos, document.getElementById('events-container'));
            return;
        }

        // Obtener la fecha seleccionada
        var fechaSeleccionada = new Date(dateInput.value);

        // Filtrar y mostrar los eventos por fecha
        var eventosFiltradosPorFecha = todosLosEventos.filter(function (evento) {
            // Obtener la fecha del evento
            var fechaEvento = new Date(evento.startDate);

            // Comparar si la fecha del evento coincide con la fecha seleccionada
            return esMismaFecha(fechaEvento, fechaSeleccionada);
        });

        // Mostrar solo los eventos filtrados por fecha
        mostrarEventos(eventosFiltradosPorFecha, document.getElementById('events-container'));
    });
}


// Función para verificar si dos fechas son iguales (mismo año, mes y día)
function esMismaFecha(fecha1, fecha2) {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
        fecha1.getMonth() === fecha2.getMonth() &&
        fecha1.getDate() === fecha2.getDate();
}

// Función para manejar el filtro por nombre de artista intérprete del evento
function manejarFiltroPorNombre() {
    // Obtener el campo de entrada de texto para el nombre del artista
    var inputNombreArtista = document.getElementById('search-input');

    // Agregar un event listener para detectar cambios en el campo de entrada de texto
    inputNombreArtista.addEventListener('input', function () {
        // Obtener el valor actual del campo de entrada de texto
        var nombreArtista = inputNombreArtista.value.trim().toLowerCase(); // Convertir a minúsculas y eliminar espacios en blanco al principio y al final

        // Filtrar y mostrar los eventos nuevamente con el nuevo filtro por nombre del artista
        var eventosFiltradosPorNombre = todosLosEventos.filter(function (evento) {
            return evento.performer.some(function (artista) {
                return artista.name.toLowerCase().includes(nombreArtista);
            });
        });

        // Mostrar solo los eventos filtrados por nombre del artista
        mostrarEventos(eventosFiltradosPorNombre, document.getElementById('events-container'));
    });
}

// Función para obtener las coordenadas de un lugar mediante geocodificación inversa con OpenStreetMap Nominatim API
function obtenerCoordenadasLugar(nombreLugar, callback) {
    // URL base de la API de Nominatim
    var apiUrl = 'https://nominatim.openstreetmap.org/search';

    // Parámetros de la solicitud
    var params = {
        q: nombreLugar,
        format: 'json'
    };

    // Construir la URL completa con los parámetros de la solicitud
    var urlCompleta = apiUrl + '?' + new URLSearchParams(params);

    // Realizar la solicitud HTTP GET
    fetch(urlCompleta)
        .then(response => response.json())
        .then(data => {
            // Verificar si se encontraron resultados
            if (data && data.length > 0) {
                // Obtener las coordenadas del primer resultado
                var latitud = parseFloat(data[0].lat);
                var longitud = parseFloat(data[0].lon);

                // Llamar al callback con las coordenadas obtenidas
                callback(latitud, longitud);
            } else {
                // Si no se encontraron resultados, llamar al callback con null
                callback(null, null);
            }
        })
        .catch(error => {
            console.error('Error al obtener las coordenadas:', error);
            // Si ocurre un error, llamar al callback con null
            callback(null, null);
        });
}
