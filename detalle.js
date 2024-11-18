$(window).on('scroll', function() {
    var scrollPos = $(window).scrollTop();
    $('header').css('background-position', 'center ' + (scrollPos * 0.5) + 'px');
  });

const parametroId = new URLSearchParams(window.location.search)
const localisacion = parseInt(parametroId.get("id"))
fetch("cards.json").then(resp=>resp.json()).then(dato=>{
    const detalleCarta = dato.find(item => item.id === localisacion)
    rendercard(detalleCarta)
  })


function rendercard(item) {
    const contenedor = document.getElementById("container-detalle");
    contenedor.innerHTML = "";
    const carta = document.createElement("div");
    carta.classList.add("card", "shadow-lg", "p-3", "mb-5", "bg-body-tertiary", "rounded");
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
              <button class="btn btn-primary mt-3" id="btn-comprar">Reservar ahora</button>
            </div>`;
          contenedor.appendChild(carta);

    
    document.getElementById("btn-comprar").addEventListener("click", function() {
        Toastify({
            text: "Reserva realizada para: " + item.titulo,
            duration: 2000,
            position: "center",
            style: {
                background: "#ff5400",
              }
            }).showToast();
    });
}

