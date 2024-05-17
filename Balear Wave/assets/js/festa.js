// Función para obtener el parámetro de la URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Función para cargar y procesar el JSON de festivales
function cargarFiesta() {
    // Obtener el nombre de la fiesta de los parámetros de la URL
    var nombreFiesta = getParameterByName('nombre');

    // Función interna para cargar y procesar el JSON
    fetch('https://www.festesbalears.com/json/Festes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(function (festes) {
            // Buscar la fiesta por su nombre en el JSON
            var fiestaEncontrada = festes["itemListElement"].find(festa => festa.name === nombreFiesta);

            // Verificar si se encontró la fiesta
            if (fiestaEncontrada) {
                // Mostrar el nombre de la fiesta, su descripción y su imagen en el HTML
                document.getElementById('nombre').textContent = fiestaEncontrada.name;
                document.getElementById('descripcion').textContent = fiestaEncontrada.description;
                document.getElementById('imagen').src = 'https://www.festesbalears.com/' + fiestaEncontrada.image[0].contentUrl;
            } else {
                console.error('Fiesta no encontrada.');
            }
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}

// Llamar a la función para cargar la fiesta cuando se carga la página
cargarFiesta();
