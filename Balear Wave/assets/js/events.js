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
              var map = L.map('mapa-interno').setView([latitude, longitude], 13);

              // Agregar la capa de OpenStreetMap al mapa
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);

              // Agregar un marcador en la ubicación obtenida
              L.marker([latitude, longitude]).addTo(map)
                  .bindPopup('Tu ubicación actual').openPopup();
          }, function(error) {
              // Manejar errores de geolocalización
              console.error('Error obteniendo la ubicación:', error);
          });
      } else {
          console.error('Geolocalización no es compatible con este navegador');
      }
  }
});

function generarListaEventos() {
  // Obtener el contenedor principal
  var contenedorPrincipal = document.getElementById('events-container');

  // Obtener la lista de eventos del JSON
  var eventos = data.musicData.events;

  // Iterar sobre cada evento
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

      // Crear descripción del evento
      var descripcionEvento = document.createElement('p');
      descripcionEvento.textContent = evento.description;

      // Crear botón de entradas
      var btnEntradas = document.createElement('button');
      btnEntradas.textContent = 'Entrades';
      btnEntradas.classList.add('btn', 'btn-custom');
      btnEntradas.addEventListener('click', function() {
          window.location.href = evento.offers.url;
      });

      // Agregar elementos al div de contenido del evento
      divContenido.appendChild(tituloEvento);
      divContenido.appendChild(descripcionEvento);
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

// Llamar a la función para generar la lista de eventos
generarListaEventos();



