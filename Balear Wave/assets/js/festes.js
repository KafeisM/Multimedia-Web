// Función para procesar los datos del JSON y crear la estructura HTML de festivales
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
            // Obtener el contenedor donde se agregarán los elementos
            var contenedor = document.getElementById('festes-container');

            // Iterar sobre cada festival en el JSON y crear la estructura HTML
            festes["itemListElement"].forEach(function(festa) {
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

            });
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}