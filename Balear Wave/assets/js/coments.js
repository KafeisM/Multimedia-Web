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
    var nombreFiesta = getParameterByName('nombre');

    fetch('https://www.festesbalears.com/json/Festes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el JSON: ' + response.status);
            }
            return response.json();
        })
        .then(function (festes) {
            var fiestaEncontrada = festes["itemListElement"].find(festa => festa.name === nombreFiesta);

            if (fiestaEncontrada) {
                document.getElementById('nombre').textContent = fiestaEncontrada.name;
                document.getElementById('descripcion').textContent = fiestaEncontrada.description;
                document.getElementById('imagen').src = 'https://www.festesbalears.com/' + fiestaEncontrada.image[0].contentUrl;
                loadComments(nombreFiesta);
            } else {
                console.error('Fiesta no encontrada.');
            }
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}

// Función para cargar los comentarios desde localStorage y mostrarlos
function loadComments(eventName) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = ''; // Limpiar la lista de comentarios

    const comments = JSON.parse(localStorage.getItem(eventName + '-comments')) || [];

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const authorElem = document.createElement('p');
        authorElem.classList.add('comment-author');
        authorElem.textContent = comment.author;

        const textElem = document.createElement('p');
        textElem.classList.add('comment-text');
        textElem.textContent = comment.text;

        commentDiv.appendChild(authorElem);
        commentDiv.appendChild(textElem);

        commentsList.appendChild(commentDiv);
    });
}

// Función para agregar un nuevo comentario a localStorage y actualizar la lista
function addComment(eventName, author, text) {
    const comments = JSON.parse(localStorage.getItem(eventName + '-comments')) || [];
    comments.push({author, text});
    localStorage.setItem(eventName + '-comments', JSON.stringify(comments));
    loadComments(eventName);
}

// Añadir un event listener al formulario para manejar los nuevos comentarios
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const author = document.getElementById('author').value;
    const text = document.getElementById('text').value;
    const eventName = getParameterByName('nombre');

    addComment(eventName, author, text);

    document.getElementById('comment-form').reset();
});

// Llamar a la función para cargar la fiesta cuando se carga la página
cargarFiesta();
