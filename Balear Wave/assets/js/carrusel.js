// Función para procesar los datos del JSON y crear la estructura HTML de noveetats
function procesarCarrusel() {
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
            var carouselInner = document.querySelector('.carousel-inner');
            var carouselIndicators = document.querySelector('.carousel-indicators');

            // Iterar sobre cada artículo en el JSON y crear la estructura HTML para el carrusel
            novetats.newsHighlights.forEach(function(article, index) {
                // Crear div para el elemento del carrusel
                var carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                // Crear la imagen
                var img = document.createElement('img');
                img.classList.add('d-block');
                img.classList.add('w-100');
                img.src = article.image;
                img.alt = 'Slide ' + (index + 1);

                // Crear el div para la leyenda del carrusel
                var carouselCaption = document.createElement('div');
                carouselCaption.classList.add('carousel-caption');
                carouselCaption.classList.add('d-none');
                carouselCaption.classList.add('d-md-block');

                // Crear el título
                var title = document.createElement('h5');
                title.textContent = article.headline;

                // Crear el párrafo de la descripción
                var description = document.createElement('p');
                description.textContent = article.description;

                // Agregar el título y la descripción al div de la leyenda
                carouselCaption.appendChild(title);
                carouselCaption.appendChild(description);

                // Agregar la imagen y la leyenda al div del elemento del carrusel
                carouselItem.appendChild(img);
                carouselItem.appendChild(carouselCaption);

                // Agregar el elemento del carrusel al contenedor del carrusel
                carouselInner.appendChild(carouselItem);

                // Crear indicador para este elemento
                var indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.dataset.bsTarget = '#carouselExampleCaptions';
                indicator.dataset.bsSlideTo = index;
                indicator.setAttribute('aria-label', 'Slide ' + (index + 1));
                if (index === 0) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }
                carouselIndicators.appendChild(indicator);
            });

            // Agregar los botones de control al carrusel
            var carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
            carouselControls.forEach(function(control) {
                control.dataset.bsTarget = '#carouselExampleCaptions';
            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}
