document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al botón de mapa
    var botonMapa = document.querySelector('#boton-mapa-festes');

    // Obtener referencia al contenedor del mapa
    var mapaContainer = document.getElementById('mapa-festes');

    // Agregar un event listener al botón de mapa
    botonMapa.addEventListener('click', function() {
        console.log("BOTO FESTES")
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
                var map = L.map('mapa-interno-festes').setView([latitude, longitude], 10);

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
                marcarUbicacionesFiestas(map, latitude, longitude);
            }, function(error) {
                // Manejar errores de geolocalización
                console.error('Error obteniendo la ubicación:', error);
            });
        } else {
            console.error('Geolocalización no es compatible con este navegador');
        }
    }

    function marcarUbicacionesFiestas(map, lat, lon) {
            
        // Iterar sobre cada fiesta y marcar su ubicación en el mapa
        todasLasFiestas.forEach(function(fiesta) {
            // Obtener las coordenadas de latitud y longitud de la fiesta
            var latitud = parseFloat(fiesta.geo.latitude);
            var longitud = parseFloat(fiesta.geo.longitude);

            console.log("LAT: ", latitud)
            console.log("LON: ", longitud)
    
            // Verificar si se obtuvieron las coordenadas
            if (!isNaN(latitud) && !isNaN(longitud)) {
                // Crear un icono para la fiesta
                var iconoFiesta = L.icon({
                    iconUrl: 'https://www.balearwave.com/assets/img/events/location.png', // Ruta a tu icono personalizado para fiestas
                    iconSize: [32, 32], // Tamaño del icono
                    iconAnchor: [16, 32], // Punto de anclaje del icono
                    popupAnchor: [0, -32] // Punto donde se abrirá el popup del marcador
                });
    
                // Agregar un marcador en la ubicación de la fiesta con el icono correspondiente
                L.marker([latitud, longitud], { icon: iconoFiesta }).addTo(map)
                    .bindPopup(fiesta.name).openPopup(); // Reemplaza "fiesta.name" con el nombre de tu propiedad en el JSON
            } else {
                console.log('No se encontraron coordenadas válidas para', fiesta.name);
            }
        });
    }
    
    
    
});
// Lista global para almacenar todas las fiestas
var todasLasFiestas = [];

function procesarFestes() {
    // Función interna para cargar y procesar el JSON
    fetch('https://www.festesbalears.com/json/Festes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(function (festes) {
            // Verificar si festes es undefined
            if (!festes || !festes.itemListElement) {
                throw new Error('El JSON recuperado no tiene el formato esperado');
            }

            // Obtener el contenedor donde se agregarán los elementos
            var contenedor = document.getElementById('festes-container');

            // Iterar sobre cada festival en el JSON y crear la estructura HTML
            festes.itemListElement.forEach(function(festa) {
                // Crear div principal
                var divFesta = document.createElement('div');
                divFesta.classList.add('row');

                // Suponiendo que `data` es el objeto JSON que contiene la lista `itemListElement`
                // Accede a la URL de la imagen
                const imageUrl = 'https://www.festesbalears.com/' + festa.image[0].contentUrl;

                // Crear el contenedor div con clase "col-lg-4" y atributo "data-aos"
                const divContainer1 = document.createElement('div');
                divContainer1.classList.add('col-lg-4');
                divContainer1.setAttribute('data-aos', 'fade-right');

                // Crear la etiqueta img con el atributo src y clase "img-fluid"
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', imageUrl); // Utiliza la URL de la imagen obtenida
                imgElement.classList.add('img-fluid');
                imgElement.setAttribute('alt', '');

                // Agregar la etiqueta img como hijo del contenedor div
                divContainer1.appendChild(imgElement);

                // Crear el contenedor div con clase "col-lg-8 pt-4 pt-lg-0 content" y atributo "data-aos"
                const divContainer2 = document.createElement('div');
                divContainer2.classList.add('col-lg-8', 'pt-4', 'pt-lg-0', 'content');
                divContainer2.setAttribute('data-aos', 'fade-left');

                // Crear el elemento h3 con el nombre del festival
                const h3Element = document.createElement('h3');
                h3Element.textContent = festa.name;

                // Crear el elemento div con clase "row"
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row');

                const colDiv = document.createElement('div');
                colDiv.classList.add('col-lg-6');

                // Crear la lista ul
                const ulElement = document.createElement('ul');

                // Crear los elementos li dentro de la lista
                const listItems = [
                    { iconClass: 'bi-calendar-event', label: 'Data inici:', value: festa.startDate },
                    { iconClass: 'bi-calendar-event', label: 'Data final:', value: festa.endDate },
                    { iconClass: 'bi-geo-alt', label: 'Localització:', value: `${festa.address.addressLocality}, ${festa.address.addressRegion}, ${festa.address.postalCode}` }
                ];

                listItems.forEach(item => {
                    const liElement = document.createElement('li');
                    const icon = document.createElement('i');
                    icon.classList.add('bi', item.iconClass);
                    liElement.appendChild(icon);
                    liElement.innerHTML += `<strong>${item.label}</strong> <span>${item.value}</span>`;
                    ulElement.appendChild(liElement);
                });

                // Agregar la lista al div de la columna
                colDiv.appendChild(ulElement);

                // Agregar el div de la columna al div de la fila
                rowDiv.appendChild(colDiv);

                // Crear el elemento a para el botón de comprar entradas
                const aElement = document.createElement('a');
                aElement.setAttribute('href', 'festa.html?nombre=' + encodeURIComponent(festa.name));
                aElement.setAttribute('class', 'btn btn-custom');
                aElement.setAttribute('target', '_blank');
                aElement.textContent = 'Descripció';

                // Agregar todos los elementos al contenedor div principal
                divContainer2.appendChild(h3Element);
                divContainer2.appendChild(rowDiv);
                divContainer2.appendChild(aElement);

                // Agregar divContainer1 como hijo de divFestival
                divFesta.appendChild(divContainer1);

                // Agregar divContainer2 como hijo de divFestival
                divFesta.appendChild(divContainer2);

                // Crear el elemento hr
                const hrElement = document.createElement('hr');
                const hrElement2 = document.createElement('hr');

                contenedor.appendChild(divFesta);
                contenedor.appendChild(hrElement);
                contenedor.appendChild(hrElement2);

                // Agregar la fiesta a la lista global
                todasLasFiestas.push(festa);
            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}

