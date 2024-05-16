// Función para procesar los datos del JSON y crear la estructura HTML de festivales
function procesarVerbenes() {
    // Función interna para cargar y procesar el JSON
    fetch('https://www.degresca.com/assets/json/verbenes.json', {
        mode : 'no-cors'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(function (festes) {
            // Obtener el contenedor donde se agregarán los elementos
            var contenedor = document.getElementById('festes-container');

            // Iterar sobre cada festival en el JSON y crear la estructura HTML
            festes["itemListElement"].forEach(function(festa) {
                // Crear div principal
                var divFesta = document.createElement('div');
                divFesta.classList.add('row');

                // Suponiendo que `data` es el objeto JSON que contiene la lista `itemListElement`
                // Accede a la URL de la imagen
                const imageUrl = festa.image[0].url;

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
                    { iconClass: 'bi-clock', label: 'Duració:', value: festa.duration },
                    { iconClass: 'bi-geo-alt', label: 'Localització:', value: festa.location.name },
                    { iconClass: 'bi-signpost', label: 'Adreça:', value: festa.location.address },
                    { iconClass: 'bi-people-fill', label: 'Organitzador:', value: festa.organizer.name }, 
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

                // Variable para almacenar el elemento <p>
                var pElement = document.createElement('p');
                pElement.textContent = festa.description;

                // Crear la lista ul para el precio
                const priceUlElement = document.createElement('ul');
                const priceLiElement = document.createElement('li');
                const priceIcon = document.createElement('i');
                priceIcon.classList.add('bi', 'bi-cash');
                priceLiElement.appendChild(priceIcon);
                priceLiElement.innerHTML += `<strong>Preu:</strong> <span>${festa.price}</span>`;
                priceUlElement.appendChild(priceLiElement);

                // Crear el elemento a para el botón de comprar entradas
                const aElement = document.createElement('a');
                aElement.setAttribute('href', festa.linkEntrada);
                aElement.setAttribute('class', 'btn btn-custom');
                aElement.setAttribute('target', '_blank');
                aElement.textContent = 'Comprar entrades';

                // Agregar todos los elementos al contenedor div principal
                divContainer2.appendChild(h3Element);
                divContainer2.appendChild(rowDiv);
                divContainer2.appendChild(pElement);
                divContainer2.appendChild(aElement);

                // Agregar divContainer1 como hijo de divFestival
                divFesta.appendChild(divContainer1);

                // Agregar divContainer2 como hijo de divFestival
                divFesta.appendChild(divContainer2);

                // Crear el elemento hr
                const hrElement = document.createElement('hr');

                contenedor.appendChild(divFesta);
                contenedor.appendChild(hrElement);

                
            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}