// Función para procesar los datos del JSON y crear la estructura HTML de noveetats
function procesarJSON() {
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
            var contenedor = document.getElementById('.row.novetats-container');
  
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
                } else if (article.video) {
                    mediaElement = document.createElement('video');
                    mediaElement.classList.add('img-fluid');
                    mediaElement.controls = true;
  
                    // Crear fuente de video
                    var source = document.createElement('source');
                    source.src = article.video;
                    source.type = 'video/mp4';
  
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
  
                // Agregar elemento multimedia al div principal
                if (mediaElement) {
                    divItem.appendChild(mediaElement);
                }
  
                // Agregar título y párrafo al div de contenido
                divContent.appendChild(titulo);
                divContent.appendChild(parrafo);
  
                // Agregar div de contenido al div principal
                divItem.appendChild(divContent);
                // Agregar div principal al contenedor
                contenedor.appendChild(divItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
  }