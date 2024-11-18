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
      // Definir los IDs de los campos según la fuente
      const zoneId = source === 'top' ? 'search-zone' : 'sidebar-search-zone';
      const checkinId = source === 'top' ? 'search-checkin' : 'sidebar-search-checkin';
      const checkoutId = source === 'top' ? 'search-checkout' : 'sidebar-search-checkout';
    
      // Obtener los valores de los filtros
      const zoneFilter = document.getElementById(zoneId).value.toLowerCase();
      const checkinDate = document.getElementById(checkinId).value;
      const checkoutDate = document.getElementById(checkoutId).value;
    
      // Obtener todas las tarjetas y títulos h2
      const cards = document.querySelectorAll('.card');
      const titles = document.querySelectorAll('h2');
    
      // Si todos los campos están vacíos, mostramos todas las tarjetas y títulos
      if (!zoneFilter && !checkinDate && !checkoutDate) {
        cards.forEach(card => {
          card.style.display = '';
        });
        titles.forEach(title => {
          title.style.display = '';
        });
        return;
      }
    
      // Convertimos las fechas a objetos Date solo si están definidas
      const checkinDateObj = checkinDate ? new Date(checkinDate) : null;
      const checkoutDateObj = checkoutDate ? new Date(checkoutDate) : null;
    
      // Filtramos las tarjetas
      cards.forEach(card => {
        const zone = card.querySelector('h3').textContent.toLowerCase();
        const dateText = card.querySelector('.card-info p:nth-child(3)').textContent;
        const [start, end] = dateText.split(' al ').map(dateStr => new Date(dateStr.trim() + ' 2023'));
    
        // Verifica cada filtro
        const matchesZone = !zoneFilter || zone.includes(zoneFilter);
        const matchesDate = 
          (!checkinDateObj || (checkinDateObj >= start && checkinDateObj <= end)) && 
          (!checkoutDateObj || (checkoutDateObj >= start && checkoutDateObj <= end));
    
        // Muestra u oculta la tarjeta según los filtros
        card.style.display = matchesZone && matchesDate ? '' : 'none';
      });
    
      // Verificamos cada título h2 para ver si tiene tarjetas visibles debajo
      titles.forEach(title => {
        // Selecciona todas las tarjetas que están después del título h2 hasta el siguiente h2
        let nextElement = title.nextElementSibling;
        let hasVisibleCards = false;
        
        while (nextElement && nextElement.classList.contains('card')) {
          if (nextElement.style.display !== 'none') {
            hasVisibleCards = true;
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }
    
        // Muestra o oculta el título según si tiene tarjetas visibles
        title.style.display = hasVisibleCards ? '' : 'none';
      });
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



    
          carta.addEventListener("click", () => {
            window.location.href = `detalle.html?id=${item.id}`;
          });
        });
    
        currentIndex = nextIndex;
    
        if (currentIndex >= filteredSource.length) {
          document.getElementById("mostrar-mas-container").style.display = "none";
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
      } else {
        explorarDiv.style.display = "block";
      }
    }
    
        currentIndex = nextIndex; // Actualizar el índice actual
    
        // Mostrar u ocultar el botón según si quedan más elementos
        if (currentIndex >= source.length) {
          document.getElementById("mostrar-mas-container").style.display = "none";
        }
      
    
      // Limpiar el contenedor y renderizar los primeros elementos
      contenedor.innerHTML = ""; 
      currentIndex = 0;
      renderNextBatch();
    
      // Crear el contenedor del botón "Mostrar más" si no existe
      let explorarDiv = document.getElementById("mostrar-mas-container");
      if (!explorarDiv) {
        explorarDiv = document.createElement("div");
        explorarDiv.id = "mostrar-mas-container";
        explorarDiv.classList.add("explorar-mas");
        explorarDiv.innerHTML = `
          <p>Seguir explorando alojamientos</p>
          <button id="mostrar-mas">Mostrar más</button>`;
        contenedor.parentElement.appendChild(explorarDiv);
    
        // Agregar funcionalidad al botón "Mostrar más"
        document.getElementById("mostrar-mas").addEventListener("click", renderNextBatch);
      } else {
        explorarDiv.style.display = "block"; // Asegurarse de que sea visible
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