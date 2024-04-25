window.onload = function() {
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

          // El primer album a la llista es el mes recent
          var albumMasReciente = artista.album[0];

          // Cercar el iframe en el HTML
          var iframe = document.getElementById('albumes-container').getElementsByTagName('iframe')[0];

          // Posar el src del iframe al link de Spotify del àlbum
          iframe.src = albumMasReciente.spotifyAlbumLink;
          console.log(iframe.src);
  
          var divAlbumes = document.getElementById('albumes');
          artista.album.forEach(album => {
            var h3 = document.createElement('h3');
            h3.textContent = album.name;
            divAlbumes.appendChild(h3);
  
            var img = document.createElement('img');
            img.src = album.image;
            img.alt = 'Imagen del álbum ' + album.name;
            divAlbumes.appendChild(img);
  
            var p = document.createElement('p');
            p.textContent = 'Publicado el ' + album.datePublished;
            divAlbumes.appendChild(p);

          
          });
        }
      });
  };
  