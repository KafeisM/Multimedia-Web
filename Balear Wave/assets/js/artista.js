window.onload = function() {
    // Botón de volver atrás
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'index.html#artistes';
    });
  
    var params = new URLSearchParams(window.location.search);
    var nombreArtista = params.get('nombre');
    console.log(nombreArtista);
  
    fetch('https://www.balearwave.com/assets/data/events.json')
        .then(response => response.json())
        .then(data => {
            var artistas = data.musicData.artists;
            var artista = artistas.find(a => a.name.toLowerCase() === nombreArtista.toLowerCase());
  
            if (artista) {
                document.getElementById('nombre').textContent = artista.name;
                document.getElementById('imagen').src = artista.image;
                document.getElementById('descripcion').textContent = artista.description;
  
                // El primer álbum en la lista es el más reciente
                var albumMasReciente = artista.album[0];
  
                // Buscar el iframe en el HTML
                var iframe = document.getElementById('albumes-container').getElementsByTagName('iframe')[0];
  
                // Poner el src del iframe al link de Spotify del álbum
                iframe.src = albumMasReciente.url; // Cambiado a 'url' conforme al nuevo esquema
                console.log(iframe.src); 
            }
        });
  };
  