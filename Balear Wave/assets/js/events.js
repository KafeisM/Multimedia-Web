document.addEventListener('DOMContentLoaded', () => {    
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
        if (mapaContainer.style.display === 'none' || mapaContainer.style.display === '') {
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
                    iconUrl: 'assets/img/events/user-location.png', // Ruta a tu icono personalizado
                    iconSize: [32, 32], // Tamaño del icono
                    iconAnchor: [16, 32], // Punto de anclaje del icono
                    popupAnchor: [0, -32] // Punto donde se abrirá el popup del marcador
                });
                L.marker([latitude, longitude], { icon: ubicacionActualIcono }).addTo(map)
                    .bindPopup('Tu ubicación actual').openPopup();
    
                // Marcar ubicaciones de eventos en el mapa
                marcarUbicacionesEventos(map);
            }, function(error) {
                // Manejar errores de geolocalización
                console.error('Error obteniendo la ubicación:', error);
            });
        } else {
            console.error('Geolocalización no es compatible con este navegador');
        }
    }
    
    // Función para obtener coordenadas del lugar del evento utilizando OpenStreetMap
    function obtenerCoordenadasLugar(nombreLugar, callback) {
        // Construir la URL de la solicitud de geocodificación
        var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(nombreLugar);

        // Realizar la solicitud a la API de geocodificación de OpenStreetMap
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener las coordenadas para ' + nombreLugar);
                }
                return response.json();
            })
            .then(data => {
                // Verificar si se obtuvieron resultados de la búsqueda
                if (data.length > 0) {
                    // Obtener las coordenadas del primer resultado
                    var latitud = parseFloat(data[0].lat);
                    var longitud = parseFloat(data[0].lon);
                    callback(latitud, longitud);
                } else {
                    // No se encontraron resultados, devolver null para las coordenadas
                    callback(null, null);
                }
            })
            .catch(error => {
                console.error('Error obteniendo coordenadas para ' + nombreLugar + ':', error);
                // Devolver null para las coordenadas en caso de error
                callback(null, null);
            });
    }

    // Función para marcar ubicaciones de eventos en el mapa utilizando OpenStreetMap
    function marcarUbicacionesEventos(map) {
        // Iterar sobre cada evento y marcar su ubicación en el mapa
        todosLosEventos.forEach(function(evento) {
            obtenerCoordenadasLugar(evento.location.name, function(latitud, longitud) {
                // Verificar si se obtuvieron las coordenadas
                if (latitud !== null && longitud !== null) {
                    // Agregar un marcador en la ubicación del evento
                    var iconoEvento = L.icon({
                        iconUrl: 'assets/img/events/location.png', // Ruta al icono personalizado para eventos
                        iconSize: [32, 32], // Tamaño del icono
                        iconAnchor: [16, 32], // Punto de anclaje del icono
                        popupAnchor: [0, -32] // Punto donde se abrirá el popup del marcador
                    });
                    L.marker([latitud, longitud], {icon: iconoEvento}).addTo(map)
                        .bindPopup(evento.name);
                } else {
                    console.log('No se encontraron coordenadas para', evento.location.name);
                }
            });
        });
    }

    
    // Variable global para almacenar todos los eventos
    var todosLosEventos = [];
    var favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; // Cargar favoritos desde localStorage

    // Objeto para almacenar los valores de los filtros
    var filtros = {
        genero: 'todos',
        precio: 100, // Asume el valor máximo del filtro de precio
        fechaInicio: null,
        fechaFin: null,
        nombre: ''
    };

    
    function generarListaEventos() {
        var contenedorPrincipal = document.getElementById('events-container');
    
        fetch('assets/data/events.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el JSON: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                todosLosEventos = data.musicData.events;
                mostrarEventos(todosLosEventos, contenedorPrincipal);
    
                manejarFiltroGenero(data);
                manejarFiltroPrecio();
                manejarFiltroFecha();
                manejarFiltroPorNombre();
            })
            .catch(error => {
                console.error('Error al cargar el JSON:', error);
            });
    }
    
    
    function manejarFiltroGenero(data) {
        var selectGenero = document.getElementById('genre-select');
        selectGenero.innerHTML = '';
        var optionTodos = document.createElement('option');
        optionTodos.value = 'todos';
        optionTodos.textContent = 'Tots';
        selectGenero.appendChild(optionTodos);
    
        var artistas = data.musicData.artists;
        var generosUnicos = [...new Set(artistas.map(artist => artist.genre))];
        generosUnicos.forEach(function(genero) {
            var optionGenero = document.createElement('option');
            optionGenero.value = genero.toLowerCase();
            optionGenero.textContent = genero;
            selectGenero.appendChild(optionGenero);
        });
        selectGenero.addEventListener('change', function() {
            filtros.genero = selectGenero.value;
            console.log("Genero Seleccionad: ", selectGenero.value);
            aplicarFiltros();
        });
    }
    
    function mostrarEventos(eventos, contenedorPrincipal) {
        contenedorPrincipal.innerHTML = '';
        eventos.forEach(function(evento) {
            console.log("Evento:", evento.name);
    
            var divEvento = document.createElement('div');
            divEvento.classList.add('events-item');
            var imgEvento = document.createElement('img');
            imgEvento.src = evento.image;
            var divContenido = document.createElement('div');
            divContenido.classList.add('events-content');
            var tituloEvento = document.createElement('h3');
            tituloEvento.textContent = evento.name;
            var listaDetalles = document.createElement('ul');
            var detalles = {
                "Data": new Date(evento.startDate).toLocaleDateString(),
                "Hora": new Date(evento.startDate).toLocaleTimeString(),
                "Preu": evento.offers.price + " " + evento.offers.priceCurrency,
                "Lloc": evento.location.name
            };
    
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
    
            var divBtnContainer = document.createElement('div');
            divBtnContainer.classList.add('btn-container');
            var btnEntradas = document.createElement('button');
            btnEntradas.textContent = 'Entrades';
            btnEntradas.classList.add('btn', 'btn-custom');
            btnEntradas.addEventListener('click', function() {
                window.location.href = evento.offers.url;
            });
    
            var btnFavorito = document.createElement('button');
            btnFavorito.classList.add('btn-favorite');
            if (favoritos.some(fav => fav.name === evento.name)) {
                btnFavorito.classList.add('active');
            }
            btnFavorito.addEventListener('click', function() {
                toggleFavorito(evento, btnFavorito);
            });
    
            divBtnContainer.appendChild(btnEntradas);
            divBtnContainer.appendChild(btnFavorito);
            divContenido.appendChild(tituloEvento);
            divContenido.appendChild(listaDetalles);
            divContenido.appendChild(divBtnContainer);
            divEvento.appendChild(imgEvento);
            divEvento.appendChild(divContenido);
            contenedorPrincipal.appendChild(divEvento);
            var hr = document.createElement('hr');
            contenedorPrincipal.appendChild(hr);
    
            // Logs para los valores de los filtros
            console.log("Filtros:");
            console.log("Genero:", filtros.genero);
            console.log("Precio:", filtros.precio);
            console.log("Fecha Inicio:", filtros.fechaInicio);
            console.log("Fecha Fin:", filtros.fechaFin);
            console.log("Nombre:", filtros.nombre);
        });
    }
    

    
    
    function manejarFiltroPrecio() {
        var inputPrecio = document.getElementById('price-range');
        var spanPrecio = document.getElementById('price-value');
    
        inputPrecio.addEventListener('input', function() {
            filtros.precio = parseFloat(inputPrecio.value);
            spanPrecio.textContent = filtros.precio + '€';
            aplicarFiltros();
        });
    }

    function manejarFiltroFecha() {
        var dateI = document.getElementById('date-input');
        var dateF = document.getElementById('date-input-2');
    
        dateI.addEventListener('change', function() {
            filtros.fechaInicio = new Date(dateI.value);
            aplicarFiltros();
        });
    
        dateF.addEventListener('change', function() {
            filtros.fechaFin = new Date(dateF.value);
            aplicarFiltros();
        });
    }
    
    function manejarFiltroPorNombre() {
        var inputNombre = document.getElementById('search-input');
    
        inputNombre.addEventListener('input', function() {
            filtros.nombre = inputNombre.value.toLowerCase();
            aplicarFiltros();
        });
    }

    function aplicarFiltros() {
        var eventosFiltrados = todosLosEventos.filter(function(evento) {
            var alguno = evento.performer.some(function(artista) {
                // Verificar si el objeto tiene la propiedad genre antes de compararlo
                if (artista.genre !== undefined) {
                    console.log(artista.genre, filtros.genero);
                    return artista.genre === filtros.genero;
                } else {
                    // Manejar el caso donde artista.genre es undefined (si es necesario)
                    console.log("artista.genre es undefined");
                    return false; // O cualquier otra lógica que necesites
                }
            });
            console.log("ALGUNO: ",alguno);
            var coincideGenero = filtros.genero === 'todos' || alguno;
    
            var coincidePrecio = evento.offers.price <= filtros.precio;
    
            var fechaEvento = new Date(evento.startDate);
            var coincideFecha = (!filtros.fechaInicio || fechaEvento >= filtros.fechaInicio) &&
                                (!filtros.fechaFin || fechaEvento <= filtros.fechaFin);
    
            var coincideNombre = evento.name.toLowerCase().includes(filtros.nombre);
    
            return coincideGenero && coincidePrecio && coincideFecha && coincideNombre;
        });
        console.log("FILTRADOS: ",eventosFiltrados);
        mostrarEventos(eventosFiltrados, document.getElementById('events-container'));
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
    
    // Obtener referencia al botón de favoritos
    var btnFavoritos = document.getElementById('fav-filter');
    
    // Evento para mostrar solo favoritos
    btnFavoritos.addEventListener('click', function() {
        mostrarEventos(favoritos, document.getElementById('events-container'));
    });

    generarListaEventos();
    
    
});