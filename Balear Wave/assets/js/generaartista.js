function procesarArtistas() {
    // Función interna para cargar y procesar el JSON
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

            contenedor.style.height = '1534px';
            
  
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
                if (artist.type === 'solista') {
                    typeClass = 'filter-solistes';
                } else if (artist.type === 'grupo') {
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
                console.log(artist.name);
  
                // Crear párrafo para la descripción del artista
                var p = document.createElement('p');
                p.className = 'card-text';
                p.textContent = artist.description;
  
                // Crear botón para ver más detalles del artista
                var a = document.createElement('a');
                a.href = `artista.html?nombre=${encodeURIComponent(artist.name)}`;
                a.className = 'btn btn-custom';
                a.textContent = 'Veure més';
  
                // Agregar todos los elementos creados al div principal
                cardBody.append(h5, p, a);
                iconBox.append(img, cardBody);
                divItem.appendChild(iconBox);
                contenedor.appendChild(divItem);
            });
        });
  }