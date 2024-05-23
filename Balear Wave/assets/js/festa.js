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

                // Obtener los comentarios para esta fiesta
                var comentarios = obtenerComentarios(nombreFiesta);

                // Mostrar los comentarios en la página
                var comentariosHTML = '';
                if (comentarios && comentarios.length > 0) {
                    comentarios.forEach(function(comentario) {
                        comentariosHTML += `
                            <div class="testimonial-item">
                                <p>
                                    <i class="bx bxs-quote-alt-left quote-icon-left"></i>
                                    ${comentario.comentario}
                                    <i class="bx bxs-quote-alt-right quote-icon-right"></i>
                                </p>
                                <img src="${comentario.imagen}" class="testimonial-img" alt="">
                                <h3>${comentario.usuario}</h3>
                                <h4></h4>
                            </div>
                        `;
                    });
                } else {
                    comentariosHTML = '<p>No hi ha comentaris per aquesta festa.</p>';
                }

                // Agregar el código HTML de los testimonios debajo de la descripción del evento
                var testimoniosHTML = `
                <div class="testimonials container">
                    <div class="section-title">
                        <h2>Comentaris</h2>
                    </div>
                    <div class="testimonials-list">
                        ${comentariosHTML}
                    </div>
                    <div class="owl-carousel testimonials-carousel"></div>
                </div>`;

                // Insertar el código HTML de los testimonios debajo de la descripción del evento
                var descripcionElement = document.getElementById('descripcion');
                descripcionElement.insertAdjacentHTML('afterend', testimoniosHTML);

                // Agregar el formulario para nuevos comentarios
                var formularioHTML = `
                <div class="add-comment container">
                    <div class="section-title">
                        <h2>Afegeix un comentari</h2>
                    </div>
                    <form id="comment-form">
                        <div class="form-group">
                            <label for="username">Nom:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="comment">Comentari:</label>
                            <textarea id="comment" name="comment" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image">Imatge:</label>
                            <input type="file" id="image" name="image" accept="image/*">
                        </div>
                        <button class="btn-custom" type="submit">Enviar</button>
                    </form>
                </div>`;

                descripcionElement.insertAdjacentHTML('afterend', formularioHTML);

                // Agregar el event listener para el formulario de comentarios
                document.getElementById('comment-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    var usuario = document.getElementById('username').value;
                    var comentario = document.getElementById('comment').value;
                    var imagenInput = document.getElementById('image');

                    if (imagenInput.files && imagenInput.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function(e) {
                            var imagen = e.target.result;
                            agregarComentario(nombreFiesta, usuario, comentario, imagen);
                            location.reload(); // Recargar la página para mostrar el nuevo comentario
                        };

                        reader.readAsDataURL(imagenInput.files[0]);
                    } else {
                        var imagenPredeterminada = 'https://www.balearwave.com/assets/img/testimonials/nadie.webp';
                        agregarComentario(nombreFiesta, usuario, comentario, imagenPredeterminada);
                        location.reload(); // Recargar la página para mostrar el nuevo comentario
                    }
                });
            } else {
                console.error('Fiesta no encontrada.');
            }
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
        });
}

// Función para obtener los comentarios desde el localStorage
function obtenerComentarios(nombreFiesta) {
    var comentariosGuardados = JSON.parse(localStorage.getItem('comentariosPorFiesta')) || {};
    var comentariosPredeterminados = comentariosPorFiesta[nombreFiesta] || [];
    var comentariosTotales = comentariosPredeterminados.concat(comentariosGuardados[nombreFiesta] || []);
    return comentariosTotales;
}

// Función para agregar un nuevo comentario y guardarlo en el localStorage
function agregarComentario(nombreFiesta, usuario, comentario, imagen) {
    var comentariosGuardados = JSON.parse(localStorage.getItem('comentariosPorFiesta')) || {};
    if (!comentariosGuardados[nombreFiesta]) {
        comentariosGuardados[nombreFiesta] = [];
    }
    comentariosGuardados[nombreFiesta].push({
        usuario: usuario,
        comentario: comentario,
        imagen: imagen
    });
    localStorage.setItem('comentariosPorFiesta', JSON.stringify(comentariosGuardados));
}

// Llamar a la función para cargar la fiesta cuando se carga la página
cargarFiesta();

const comentariosPorFiesta = {
    "Sant Joan": [
      {
        "usuario": "Antoni Fuster",
        "comentario": "La festa de Sant Joan a Menorca és una experiència que realment encanta tothom. Les fogueres brillants, les tradicionals carreres de cavalls i la joia contagiosa creen un ambient festiu únic que et fa sentir part d'una cosa especial. És una celebració que deixa una empremta duradora al cor dels qui l'experimenten.",
        "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-5.jpg"
      },
      {
        "usuario": "Miquel Pons",
        "comentario": "Sant Joan a Menorca és una festa que captiva amb la seva atmosfera única i vibrant. Des de les impressionants fogueres fins a l'emocionant competència de cavalls, cada moment és ple d'emoció i d'energia. Tot i això, la multitud pot resultar aclaparadora per a alguns, encara que val la pena submergir-se en la màgia d'aquesta celebració.",
        "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-4.jpg"
      }
    ],
    "Sant Antoni": [
      {
        "usuario": "Catalina Ferrer",
        "comentario": "Sant Antoni a Sa Pobla ofereix una autèntica experiència mallorquina amb les seves desfilades de dimonis i benediccions d'animals. Tot i que la multitud pot ser aclaparadora, l'ambient festiu i les tradicions locals fan que valgui la pena.",
        "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-2.jpg"
      },
      {
        "usuario": "Margalida Roig",
        "comentario": "La festa de Sant Antoni a Sa Pobla és una celebració enèrgica i acolorida que destaca pels seus rituals tradicionals i la seva música típica. Tot i l'afluència de turistes, l'autenticitat d'aquesta festa la converteix en una experiència única.",
        "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-3.jpg"
      }
    ],
    "La Beata": [
        {
            "usuario": "Llorenç Morey",
            "comentario": "La Beata de Santa Margalida és una festivitat arrelada a la devoció religiosa i la tradició local. Tot i que no té esdeveniments més contemporanis, ofereix una experiència enriquidora per als que busquen submergir-se en l'espiritualitat mallorquina.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Magdalena Fullana",
            "comentario": "La Beata de Santa Margalida és una celebració que reflecteix la profunda religiositat de la comunitat local. Amb les seves processons i esdeveniments culturals, ofereix una visió autèntica de la vida a l'illa, encara que potser no és tan atractiva per a alguns turistes.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "La festa del Vermar": [
        {
            "usuario": "Pere Gelabert",
            "comentario": "La festa del Vermar és una celebració del vi i la collita que atrau els amants de l'enologia i la gastronomia. Tot i que la saturació de turistes li pot restar una mica d'encant local, ofereix una experiència sensorialment enriquidora amb degustacions i activitats relacionades amb el vi.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-4.jpg"
        },
        {
            "usuario": "Joana Riera",
            "comentario": "La festa del Vermar és una oportunitat per gaudir de la rica cultura vinícola de la regió. Tot i la presència de turistes, les degustacions i activitats ofereixen una experiència única que destaca la importància de la tradició vinícola a l'illa.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-3.jpg"
        }
      ],
      "Moros i cristians": [
        {
            "usuario": "Bartomeu Serra",
            "comentario": "Moros i Cristians és una representació acolorida i emocionant de la història i la cultura de Mallorca. Tot i que l'enfocament a la guerra pot resultar desafiant per a alguns, les desfilades i recreacions històriques són impressionants i ofereixen una visió fascinant del passat de l'illa.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-4.jpg"
        },
        {
            "usuario": "Francisca Ordines",
            "comentario": "Moros i Cristians és una festa que transporta els visitants a temps passats amb les seves desfilades i recreacions històriques. Tot i que pot no ser del gust de tots a causa del seu enfocament a la guerra, ofereix una experiència única que destaca la diversitat cultural de la regió.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "Festes de la Terra": [
        {
            "usuario": "Sebastià Salom",
            "comentario": "Les Festes de la Terra són una celebració diversa i emocionant de la cultura mallorquina contemporània. Tot i que la comercialització li pot restar una mica d'autenticitat, els esdeveniments culturals i concerts ofereixen una visió completa de la vida a l'illa.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Maria Florit",
            "comentario": "Les Festes de la Terra són una oportunitat per celebrar la rica cultura mallorquina. Tot i que la comercialització pot ser un inconvenient, els concerts i activitats ofereixen una experiència vibrant que destaca la diversitat cultural de la regió.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-3.jpg"
        }
      ],
      "Festa de Sant Martí de Es Mercadal": [
        {
            "usuario": "Guillem Galmés",
            "comentario": "La Festa de Sant Martí en Es Mercadal es una celebración tradicional llena de encanto y hospitalidad. Aunque puede carecer de atracciones modernas, ofrece una visión auténtica de la vida en la isla y una oportunidad para conectarse con la comunidad local.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Aina Barceló",
            "comentario": "La Festa de Sant Martí a Es Mercadal és una festivitat que ofereix una experiència autèntica de la vida a l'illa. Tot i que pot no tenir el mateix atractiu per a tots els turistes a causa de la manca d'atraccions modernes, ofereix una visió enriquidora de la cultura local.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "Sant Sebastià": [
        {
            "usuario": "Jaume Gual",
            "comentario": "Sant Sebastià a Palma és una festa que combina la tradició amb la modernitat de manera espectacular. Tot i que l'aglomeració de persones pot resultar aclaparadora per a alguns, els correfocs, concerts i activitats culturals ofereixen una experiència vibrant i emocionant",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Antoni Mascaró",
            "comentario": "Sant Sebastià en Palma es una celebración que atrae con su atmósfera festiva y sus emocionantes actividades. Aunque puede resultar abrumadora debido a la gran cantidad de personas, ofrece una experiencia única que destaca la vitalidad de la cultura mallorquina.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-4.jpg"
        }
      ],
      "El Cosso": [
        {
            "usuario": "Miquel Vidal",
            "comentario": "El Cosso es una fiesta que transporta a los visitantes a un mundo de fantasía y diversión. Aunque la saturación de turistas puede restarle algo de autenticidad, los desfiles y actividades ofrecen una experiencia mágica que deleita a toda la familia.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-4.jpg"
        },
        {
            "usuario": "Aina Pons",
            "comentario": "El Cosso és una celebració impressionant que captiva amb les seves desfilades i decoracions magnífiques. Tot i que pot no ser tan autèntica a causa de la gran quantitat de turistes, ofereix una experiència màgica que transporta els visitants a un món de fantasia.",
            "imagen": "https://www.balearwave.com/assets/img/testimonials/testimonials-2.jpg"
        }
      ]
  };

