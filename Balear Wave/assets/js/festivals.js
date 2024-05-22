// Función para procesar los datos del JSON y crear la estructura HTML de festivales
function procesarFestivals() {
    // Función interna para cargar y procesar el JSON
    fetch('https://www.balearsfestivals.com/json/festivales.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(function (festivales) {

            // Obtener el contenedor donde se agregarán los elementos
            var contenedor = document.getElementById('festivals-container');

            // Iterar sobre cada festival en el JSON y crear la estructura HTML
            festivales["itemListElement"].forEach(function(festival) {
                // Crear div principal
                var divFestival = document.createElement('div');
                divFestival.classList.add('row');

                // Acceder a la URL de la imagen
                const imageUrl = festival.image[0].url;

                // Crear el contenedor div con clase "col-lg-4" y atributo "data-aos"
                const divContainer1 = document.createElement('div');
                divContainer1.classList.add('col-lg-4');
                divContainer1.setAttribute('data-aos', 'fade-right');

                // Crear la etiqueta img con el atributo src y clase "img-fluid"
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', imageUrl);
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
                h3Element.textContent = festival.name;

                // Crear el elemento div con clase "row"
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row');

                // Crear dos divs con clase "col-lg-6" para las dos columnas de la lista
                for (let i = 0; i < 2; i++) {
                    const colDiv = document.createElement('div');
                    colDiv.classList.add('col-lg-6');

                    // Crear la lista ul
                    const ulElement = document.createElement('ul');

                    // Crear los elementos li dentro de la lista
                    const listItems = [
                        { iconClass: 'bi-calendar-event', label: 'Data inici:', value: festival.startDate },
                        { iconClass: 'bi-calendar-event', label: 'Data final:', value: festival.endDate },
                        { iconClass: 'bi-person-vcard', label: 'Edat:', value: festival.typicalAgeRange },
                        { iconClass: 'bi-people-fill', label: 'Capacitat màxima:', value: festival.maximumAttendeeCapacity },
                        { iconClass: 'bi-people-fill', label: 'Capacitat restant:', value: festival.remainingAttendeeCapacity },
                        { iconClass: 'bi-geo-alt', label: 'Localització:', value: `${festival.location[0].addressLocality}, ${festival.location[0].streetAddress}, ${festival.location[0].postalCode}` }
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
                }

                // Crear el elemento p con la descripción del festival
                const pElement = document.createElement('p');
                pElement.textContent = festival.description;

                // Crear la lista ul para el precio
                const priceUlElement = document.createElement('ul');
                const priceLiElement = document.createElement('li');
                const priceIcon = document.createElement('i');
                priceIcon.classList.add('bi', 'bi-cash');
                priceLiElement.appendChild(priceIcon);
                priceLiElement.innerHTML += `<strong>Preu:</strong> <span>${festival.offers.price} ${festival.offers.priceCurrency}</span>`;
                priceUlElement.appendChild(priceLiElement);

                // Crear el elemento a para el botón de comprar entradas
                const aElement = document.createElement('a');
                aElement.setAttribute('href', festival.url);
                aElement.setAttribute('class', 'btn btn-custom');
                aElement.setAttribute('target', '_blank');
                aElement.textContent = 'Comprar entrades';

                // Agregar todos los elementos al contenedor div principal
                divContainer2.appendChild(h3Element);
                divContainer2.appendChild(rowDiv);
                divContainer2.appendChild(pElement);
                divContainer2.appendChild(priceUlElement);
                divContainer2.appendChild(aElement);

                // Agregar divContainer1 como hijo de divFestival
                divFestival.appendChild(divContainer1);

                // Agregar divContainer2 como hijo de divFestival
                divFestival.appendChild(divContainer2);

                // Agregar divFestival al contenedor principal
                contenedor.appendChild(divFestival);
            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}