// Función interna para cargar y procesar el JSON
fetch('https://www.balearwave.com/assets/data/novetats.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el JSON: ' + response.status);
        }
        return response.json();
    })
    .then(function (novetats) {
        // Obtener el contenedor donde se agregarán los elementos
        var contenedor = document.getElementById('novetats-container');
        
        // Contador para el número de imágenes
        var contadorImagenes = 1;

        // Iterar sobre cada artículo en el JSON y crear la estructura HTML
        novetats["@graph"].forEach(function(article) {
            // Comprobar si el artículo tiene una imagen o un video
            var multimedia = article.image ? article.image : article.video;

            // Crear div principal
            var divItem = document.createElement('div');
            divItem.classList.add('novetats-item');
            divItem.classList.add('filter-' + article.articleSection);

            // Crear elemento multimedia (imagen o video)
            var mediaElement;
            if (article.image) {
                mediaElement = document.createElement('img');
                mediaElement.src = article.image;
                mediaElement.classList.add('img-fluid');

                // Asignar atributo alt a la imagen
                mediaElement.alt = 'imagen' + contadorImagenes;
                contadorImagenes++; // Incrementar el contador de imágenes
            } else if (article.video) {
                mediaElement = document.createElement('video');
                mediaElement.classList.add('img-fluid');
                mediaElement.controls = true;

                // Crear fuente de video
                var source = document.createElement('source');
                source.src = article.video;
                
                // Detectar el tipo de archivo por la extensión
                if (article.video.endsWith('.mp4')) {
                    source.type = 'video/mp4';
                } else if (article.video.endsWith('.webm')) {
                    source.type = 'video/webm';
                } else {
                    console.error('Formato de video no soportado');
                }

                // Agregar fuente al video
                mediaElement.appendChild(source);

                // Agregar texto de respaldo si el navegador no soporta el video
                mediaElement.innerHTML += 'Tu navegador no soporta el elemento de video.';
            }

            // Crear div para contenido
            var divContent = document.createElement('div');
            divContent.classList.add('novetats-content');

            // Crear título
            var titulo = document.createElement('h3');
            titulo.textContent = article.headline;

            // Crear párrafo para descripción
            var parrafo = document.createElement('p');
            parrafo.textContent = article.description;

            // Crear botón de reproducción de voz
            var botonReproducir = document.createElement('button');
            botonReproducir.textContent = 'Reproduir';
            botonReproducir.classList.add('btn-custom', 'reproducir-voz');
            botonReproducir.addEventListener('click', function() {
                // Verificar si hay un mensaje de voz en curso
                if (mensajeVoz && window.speechSynthesis.speaking) {
                    // Cancelar la reproducción del mensaje de voz actual
                    window.speechSynthesis.cancel();
                    // Limpiar la referencia al mensaje de voz
                    mensajeVoz = null;
                    // Restaurar el texto del botón
                    botonReproducir.textContent = 'Reproduir';
                } else {
                    // Llamar a la función para reproducir el texto en voz alta
                    reproducirVoz(article.headline + '. ' + article.description);
                    // Cambiar el texto del botón a 'Detener'
                    botonReproducir.textContent = 'Aturar';
                }
            });

            // Agregar elemento multimedia al div principal
            if (mediaElement) {
                divItem.appendChild(mediaElement);
            }

            // Agregar título, párrafo y botón de reproducción al div de contenido
            divContent.appendChild(titulo);
            divContent.appendChild(parrafo);
            divContent.appendChild(botonReproducir);

            // Agregar div de contenido al div principal
            divItem.appendChild(divContent);
            // Agregar div principal al contenedor
            contenedor.appendChild(divItem);
        });
    })
    .catch(error => {
        console.error('Error al cargar el JSON:', error);
    });


// Variable global para almacenar el mensaje de voz actual
var mensajeVoz;

// Función para reproducir texto en voz alta
function reproducirVoz(texto) {
    // Detener la reproducción si hay un mensaje de voz en curso
    detenerReproduccion();
  
    // Crear un objeto SpeechSynthesisUtterance
    mensajeVoz = new SpeechSynthesisUtterance();
    // Establecer el texto que se va a leer en voz alta
    mensajeVoz.text = texto;
    // Establecer el idioma del texto
    mensajeVoz.lang = 'ca-ES'; // Por ejemplo: 'ca-ES' para catalán de España
    // Reproducir el texto en voz alta
    window.speechSynthesis.speak(mensajeVoz);
}

// Función para detener la reproducción de voz
function detenerReproduccion() {
    // Verificar si hay un mensaje de voz en curso
    if (mensajeVoz && window.speechSynthesis.speaking) {
        // Cancelar la reproducción del mensaje de voz actual
        window.speechSynthesis.cancel();
        // Limpiar la referencia al mensaje de voz
        mensajeVoz = null;
    }
}
