/**
* Template Name: Personal
* Updated: Jan 29 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function() {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Novetats isotope and filter
   */
  window.addEventListener('load', () => {
    let novetatsContainer = document.querySelector('.novetats-container');
    if (novetatsContainer) {
        let novetatsIsotope = new Isotope(novetatsContainer, {
            itemSelector: '.novetats-item',
            layoutMode: 'fitRows'
        });

        let novetatsFilters = document.querySelectorAll('#novetats-flters li');

        novetatsFilters.forEach((filter) => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                novetatsFilters.forEach((el) => {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                novetatsIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
            });
        });
    }
});

/**
* asrtistes filtros
*/
window.addEventListener('load', () => {
  let artistesContainer = document.querySelector('.artistes-container');
  if (artistesContainer) {
    let artistesIsotope = new Isotope(artistesContainer, {
      itemSelector: '.col-md-4', // Selecciona el contenedor de cada artista
      layoutMode: 'fitRows'
    });

    let artistesFilters = document.querySelectorAll('#artistes-flters li');
    let genreFilters = document.querySelector('#genre-flters');

    let currentFilters = ['*', '*']; // Inicializa los filtros con "todos"

    artistesFilters.forEach((filter) => {
      filter.addEventListener('click', function(e) {
        e.preventDefault();
        artistesFilters.forEach((el) => {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        currentFilters[0] = this.getAttribute('data-filter'); // Actualiza el filtro de artistas

        let finalFilter = currentFilters.filter(f => f !== '*').join(''); // Ignora el filtro "todos"
        finalFilter = finalFilter ? finalFilter : '*'; // Si no hay otros filtros, usa "todos"

        artistesIsotope.arrange({
          filter: finalFilter // Aplica el filtro final
        });
      });
    });

    genreFilters.addEventListener('change', function(e) {
      currentFilters[1] = this.value; // Actualiza el filtro de género

      let finalFilter = currentFilters.filter(f => f !== '*').join(''); // Ignora el filtro "todos"
      finalFilter = finalFilter ? finalFilter : '*'; // Si no hay otros filtros, usa "todos"

      artistesIsotope.arrange({
        filter: finalFilter // Aplica el filtro final
      });
    });
  }
});


/**
* asrtistes cercador
*/
window.addEventListener('load', () => {
  // Función para filtrar artistas según el término de búsqueda
  function filterArtists() {
      let searchTerm = document.getElementById('artist-search').value.toLowerCase();
      let artistes = document.querySelectorAll('.artistes-container .col-md-4');

      artistes.forEach((artista) => {
          let nombreArtista = artista.querySelector('.card-title').textContent.toLowerCase();
          if (nombreArtista.includes(searchTerm)) {
              artista.style.display = 'block'; // Mostrar el artista si coincide con el término de búsqueda
          } else {
              artista.style.display = 'none'; // Ocultar el artista si no coincide con el término de búsqueda
          }
      });
  }

  // Event listener para el botón de búsqueda
  document.getElementById('search-button').addEventListener('click', filterArtists);
  
  // Event listener para la tecla "Enter" en el campo de búsqueda
  document.getElementById('artist-search').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          filterArtists();
      }
  });
});

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  document.addEventListener('DOMContentLoaded', function() {
    var botonMapa = document.querySelector('#events-filters li');
    var imagenContainer = document.querySelector('#imagenContainer');

    botonMapa.addEventListener('click', function() {
        toggleImageVisibility();
    });

    function toggleImageVisibility() {
        if (imagenContainer.style.display === 'none') {
            imagenContainer.style.display = 'block';
        } else {
            imagenContainer.style.display = 'none';
        }
    }
});


})()