window.onload = function() {
    var params = new URLSearchParams(window.location.search);
    var nombreArtista = params.get('nombre');
    console.log(nombreArtista);
  
    fetch('../data/events.json')
      .then(response => response.json())
      .then(data => {
        var artistas = data.musicData.artists;
        var artista = artistas.find(a => a.name.toLowerCase() === nombreArtista.toLowerCase());
  
        if (artista) {
          document.getElementById('nombre').textContent = artista.name;
          document.getElementById('imagen').src = artista.image;
          document.getElementById('descripcion').textContent = artista.description;
  
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
  