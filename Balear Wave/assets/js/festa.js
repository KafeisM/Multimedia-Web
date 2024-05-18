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
                var comentarios = comentariosPorFiesta[nombreFiesta];

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
                    comentariosHTML = '<p>No hay comentarios para esta fiesta.</p>';
                }

                // Agregar el código HTML de los testimonios debajo de la descripción del evento
                var testimoniosHTML = `<!-- ======= Testimonials ======= -->
                <div class="testimonials container">
                    <div class="section-title">
                        <h2>Comentaris</h2>
                    </div>
                    <div class="testimonials-list">
                        ${comentariosHTML}
                    </div>
                    <div class="owl-carousel testimonials-carousel"></div>
                </div><!-- End Testimonials -->`;

                // Insertar el código HTML de los testimonios debajo de la descripción del evento
                var descripcionElement = document.getElementById('descripcion');
                descripcionElement.insertAdjacentHTML('afterend', testimoniosHTML);
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

const comentariosPorFiesta = {
    "Sant Joan": [
      {
        "usuario": "Antoni Fuster",
        "comentario": "La festa de Sant Joan a Menorca és una experiència que realment encanta tothom. Les fogueres brillants, les tradicionals carreres de cavalls i la joia contagiosa creen un ambient festiu únic que et fa sentir part d'una cosa especial. És una celebració que deixa una empremta duradora al cor dels qui l'experimenten.",
        "imagen": "assets/img/testimonials/testimonials-1.jpg"
      },
      {
        "usuario": "Miquel Pons",
        "comentario": "Sant Joan a Menorca és una festa que captiva amb la seva atmosfera única i vibrant. Des de les impressionants fogueres fins a l'emocionant competència de cavalls, cada moment és ple d'emoció i d'energia. Tot i això, la multitud pot resultar aclaparadora per a alguns, encara que val la pena submergir-se en la màgia d'aquesta celebració.",
        "imagen": "assets/img/testimonials/testimonials-4.jpg"
      }
    ],
    "Sant Antoni": [
      {
        "usuario": "Catalina Ferrer",
        "comentario": "Sant Antoni a Sa Pobla ofereix una autèntica experiència mallorquina amb les seves desfilades de dimonis i benediccions d'animals. Tot i que la multitud pot ser aclaparadora, l'ambient festiu i les tradicions locals fan que valgui la pena.",
        "imagen": "assets/img/testimonials/testimonials-2.jpg"
      },
      {
        "usuario": "Margalida Roig",
        "comentario": "La festa de Sant Antoni a Sa Pobla és una celebració enèrgica i acolorida que destaca pels seus rituals tradicionals i la seva música típica. Tot i l'afluència de turistes, l'autenticitat d'aquesta festa la converteix en una experiència única.",
        "imagen": "assets/img/testimonials/testimonials-3.jpg"
      }
    ],
    "La Beata": [
        {
            "usuario": "Llorenç Morey",
            "comentario": "La Beata de Santa Margalida és una festivitat arrelada a la devoció religiosa i la tradició local. Tot i que no té esdeveniments més contemporanis, ofereix una experiència enriquidora per als que busquen submergir-se en l'espiritualitat mallorquina.",
            "imagen": "assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Magdalena Fullana",
            "comentario": "La Beata de Santa Margalida és una celebració que reflecteix la profunda religiositat de la comunitat local. Amb les seves processons i esdeveniments culturals, ofereix una visió autèntica de la vida a l'illa, encara que potser no és tan atractiva per a alguns turistes.",
            "imagen": "assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "La festa del Vermar": [
        {
            "usuario": "Pere Gelabert",
            "comentario": "La festa del Vermar és una celebració del vi i la collita que atrau els amants de l'enologia i la gastronomia. Tot i que la saturació de turistes li pot restar una mica d'encant local, ofereix una experiència sensorialment enriquidora amb degustacions i activitats relacionades amb el vi.",
            "imagen": "assets/img/testimonials/testimonials-4.jpg"
        },
        {
            "usuario": "Joana Riera",
            "comentario": "La festa del Vermar és una oportunitat per gaudir de la rica cultura vinícola de la regió. Tot i la presència de turistes, les degustacions i activitats ofereixen una experiència única que destaca la importància de la tradició vinícola a l'illa.",
            "imagen": "assets/img/testimonials/testimonials-3.jpg"
        }
      ],
      "Moros i cristians": [
        {
            "usuario": "Bartomeu Serra",
            "comentario": "Moros i Cristians és una representació acolorida i emocionant de la història i la cultura de Mallorca. Tot i que l'enfocament a la guerra pot resultar desafiant per a alguns, les desfilades i recreacions històriques són impressionants i ofereixen una visió fascinant del passat de l'illa.",
            "imagen": "assets/img/testimonials/testimonials-1.jpg"
        },
        {
            "usuario": "Francisca Ordines",
            "comentario": "Moros i Cristians és una festa que transporta els visitants a temps passats amb les seves desfilades i recreacions històriques. Tot i que pot no ser del gust de tots a causa del seu enfocament a la guerra, ofereix una experiència única que destaca la diversitat cultural de la regió.",
            "imagen": "assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "Festes de la Terra": [
        {
            "usuario": "Sebastià Salom",
            "comentario": "Les Festes de la Terra són una celebració diversa i emocionant de la cultura mallorquina contemporània. Tot i que la comercialització li pot restar una mica d'autenticitat, els esdeveniments culturals i concerts ofereixen una visió completa de la vida a l'illa.",
            "imagen": "assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Maria Florit",
            "comentario": "Les Festes de la Terra són una oportunitat per celebrar la rica cultura mallorquina. Tot i que la comercialització pot ser un inconvenient, els concerts i activitats ofereixen una experiència vibrant que destaca la diversitat cultural de la regió.",
            "imagen": "assets/img/testimonials/testimonials-3.jpg"
        }
      ],
      "Festa de Sant Martí de Es Mercadal": [
        {
            "usuario": "Guillem Galmés",
            "comentario": "La Festa de Sant Martí en Es Mercadal es una celebración tradicional llena de encanto y hospitalidad. Aunque puede carecer de atracciones modernas, ofrece una visión auténtica de la vida en la isla y una oportunidad para conectarse con la comunidad local.",
            "imagen": "assets/img/testimonials/testimonials-1.jpg"
        },
        {
            "usuario": "Aina Barceló",
            "comentario": "La Festa de Sant Martí a Es Mercadal és una festivitat que ofereix una experiència autèntica de la vida a l'illa. Tot i que pot no tenir el mateix atractiu per a tots els turistes a causa de la manca d'atraccions modernes, ofereix una visió enriquidora de la cultura local.",
            "imagen": "assets/img/testimonials/testimonials-2.jpg"
        }
      ],
      "Sant Sebastià": [
        {
            "usuario": "Jaume Gual",
            "comentario": "Sant Sebastià a Palma és una festa que combina la tradició amb la modernitat de manera espectacular. Tot i que l'aglomeració de persones pot resultar aclaparadora per a alguns, els correfocs, concerts i activitats culturals ofereixen una experiència vibrant i emocionant",
            "imagen": "assets/img/testimonials/testimonials-5.jpg"
        },
        {
            "usuario": "Antoni Mascaró",
            "comentario": "Sant Sebastià en Palma es una celebración que atrae con su atmósfera festiva y sus emocionantes actividades. Aunque puede resultar abrumadora debido a la gran cantidad de personas, ofrece una experiencia única que destaca la vitalidad de la cultura mallorquina.",
            "imagen": "assets/img/testimonials/testimonials-4.jpg"
        }
      ],
      "El Cosso": [
        {
            "usuario": "Miquel Vidal",
            "comentario": "El Cosso es una fiesta que transporta a los visitantes a un mundo de fantasía y diversión. Aunque la saturación de turistas puede restarle algo de autenticidad, los desfiles y actividades ofrecen una experiencia mágica que deleita a toda la familia.",
            "imagen": "assets/img/testimonials/testimonials-1.jpg"
        },
        {
            "usuario": "Aina Pons",
            "comentario": "El Cosso és una celebració impressionant que captiva amb les seves desfilades i decoracions magnífiques. Tot i que pot no ser tan autèntica a causa de la gran quantitat de turistes, ofereix una experiència màgica que transporta els visitants a un món de fantasia.",
            "imagen": "assets/img/testimonials/testimonials-2.jpg"
        }
      ]
  };

