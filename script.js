$(window).on('scroll', function() {
  var scrollPos = $(window).scrollTop();
  $('header').css('background-position', 'center ' + (scrollPos * 0.5) + 'px');
});

$(document).ready(function() {
var barraBusqueda = $('.search-bar');
var encabezadoAltura = $('header').outerHeight();

$(window).on('scroll', function() {
    if ($(window).scrollTop() >= encabezadoAltura) {
      barraBusqueda.css({
        'position': 'fixed',
        'top': '0',
        'width': '100%',
        'z-index': '1000'
      }).addClass('barra-fija'); // Añadir la clase para reducir tamaño
    } else {
      barraBusqueda.css({
        'position': 'relative'
      }).removeClass('barra-fija'); // Quitar la clase para tamaño normal
    }
});
});

let flag = false;

document.addEventListener('DOMContentLoaded', () => {
  const titleElement = document.querySelector('.titles'); // Seleccionamos el elemento <h2>

  document.querySelectorAll('.categories .btn').forEach(button => {
    button.addEventListener('click', () => {
      const selectedType = button.getAttribute('data-type');
      titleElement.textContent = `${selectedType} para vos`; // Cambiamos el texto del <h2>
      filterByType(selectedType); // Filtramos las tarjetas
      if (selectedType == null){
        titleElement.textContent = `Alojamientos para vos`;
      }
    });
  });
});

document.getElementById('toggleButton').addEventListener('click', function() {
        var navSidebar = document.getElementById('navSidebar');
        navSidebar.classList.toggle('active');
    });

    function filterCards(source = 'top') { 
      const zoneId = source === 'top' ? 'search-zone' : 'sidebar-search-zone';
      const zoneFilter = document.getElementById(zoneId).value.toLowerCase();
  
      // Activar el flag si hay un filtro
      flag = !!zoneFilter;
  
      const mostrarMasContainer = document.getElementById("mostrar-mas-container");
  
      if (flag) {
          // Ocultar el botón "Mostrar más" si hay un filtro
          if (mostrarMasContainer) {
              mostrarMasContainer.style.display = "none";
          }
  
          // Filtrar los datos desde el JSON completo
          fetch("cards.json")
              .then(resp => resp.json())
              .then(data => {
                  const filteredData = data.filter(item =>
                      !zoneFilter || item.titulo.toLowerCase().includes(zoneFilter)
                  );
                  rendercard(filteredData); // Renderizar las tarjetas filtradas
              });
      } else {
          // Mostrar el botón si no hay filtro activo
          if (mostrarMasContainer) {
              mostrarMasContainer.style.display = "block";
          }
  
          // Filtrar las tarjetas renderizadas
          const cards = document.querySelectorAll('.card');
          cards.forEach(card => {
              const zone = card.querySelector('.card-title').textContent.toLowerCase();
              card.style.display = !zoneFilter || zone.includes(zoneFilter) ? '' : 'none';
          });
      }
  }
  
  

    
    fetch("cards.json").then(resp=>resp.json()).then(dato=>{
      rendercard(dato);
    })

  function rendercard(source, filterType = null) {
      const contenedor = document.getElementById("cartas");
      const maxIncrement = 10;
      let currentIndex = 0;
    
      function renderNextBatch() {
        const filteredSource = filterType
          ? source.filter(item => item.tipo === filterType)
          : source;
    
        const nextIndex = Math.min(currentIndex + maxIncrement, filteredSource.length);
        const itemsToRender = filteredSource.slice(currentIndex, nextIndex);
    
        itemsToRender.forEach(item => {
          const carta = document.createElement("div");
          carta.classList.add("card", "col-md-4"); // Clases de Bootstrap para diseño en columnas
          carta.setAttribute("data-id", item.id);
    
          // Generar el carrusel con validación de `imagen`
          const carouselIndicators = Array.isArray(item.imagen)
            ? item.imagen
                .map((_, index) => `
                  <button 
                    type="button" 
                    data-bs-target="#carousel-${item.id}" 
                    data-bs-slide-to="${index}" 
                    ${index === 0 ? "class='active'" : ""} 
                    aria-current="${index === 0 ? "true" : "false"}" 
                    aria-label="Slide ${index + 1}">
                  </button>
                `)
                .join("")
            : "";
    
          const carouselInner = Array.isArray(item.imagen)
            ? item.imagen
                .map((img, index) => `
                  <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="${img}" class="d-block w-100" alt="Imagen ${index + 1}">
                  </div>
                `)
                .join("")
            : `
                <div class="carousel-item active">
                  <img src="${item.imagen}" class="d-block w-100" alt="Imagen única">
                </div>
              `;
    
          carta.innerHTML = `
            <div id="carousel-${item.id}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                ${carouselIndicators}
              </div>
              <div class="carousel-inner">
                ${carouselInner}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${item.id}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel-${item.id}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
              </button>
            </div>
            <div class="card-body">
              <h5 class="card-title">${item.titulo}</h5>
              <p class="card-text">${item.detalles}</p>
              <p class="card-text">${item.descripcion}</p>
              <p class="card-text">${item.fechas}</p>
              <p class="card-text"><strong>${item.precio}</strong></p>
            </div>`;
          contenedor.appendChild(carta);

          
          carta.addEventListener("click", (event) => {
            // Verificamos si el clic ocurrió dentro de '.card-body' o en '.card-title'
            if (event.target.closest(".card-body") || event.target.closest(".card-title")) {
              window.location.href = `detalle.html?id=${item.id}`;
            }
          })});
    
        currentIndex = nextIndex;
        const mostrarMasContainer = document.getElementById("mostrar-mas-container");
        if (currentIndex >= filteredSource.length && mostrarMasContainer) {
            mostrarMasContainer.style.display = "none";
        }

      }
    
      contenedor.innerHTML = "";
      currentIndex = 0;
      renderNextBatch();
    
      let explorarDiv = document.getElementById("mostrar-mas-container");
      if (!explorarDiv) {
        explorarDiv = document.createElement("div");
        explorarDiv.id = "mostrar-mas-container";
        explorarDiv.classList.add("explorar-mas");
        explorarDiv.innerHTML = `
          <p>Seguir explorando alojamientos</p>
          <button id="mostrar-mas">Mostrar más</button>`;
        contenedor.parentElement.appendChild(explorarDiv);
    
        document.getElementById("mostrar-mas").addEventListener("click", renderNextBatch);
      }
  }
    
      function filterByType(type) {
        fetch("cards.json")
          .then(resp => resp.json())
          .then(data => {
            rendercard(data, type);
          });
      }
      
    
    explorarDiv.innerHTML = `
    <p class="text-muted mb-2">Seguir explorando alojamientos</p>
    <button id="mostrar-mas" class="btn btn-primary">Mostrar más</button>`;