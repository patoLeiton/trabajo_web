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
    carta.innerHTML = `
        <div class="row g-0">
            <div class="col-md-6">
                <img src=${item.imagen} alt="Alojamiento" class="img-fluid rounded-start">
            </div>
            <div class="col-md-6">
                <div class="card-body">
                    <h3 class="card-title">${item.titulo}</h3>
                    <p class="card-text">${item.descripcion}</p>
                    <p class="card-text"><small class="text-muted">${item.detalles}</small></p>
                    <p class="card-text"><strong>Fechas: </strong>${item.fechas}</p>
                    <p class="card-text"><strong>Precio: ${item.precio}</strong></p>
                    <div class="additional-info mt-4">
                        <h5>Características del Alojamiento:</h5>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-person-fill"></i> ${item.detalles}</li>
                            <li><i class="bi bi-calendar-date"></i> Disponible: ${item.fechas}</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary mt-3" id="btn-comprar">Reservar ahora</button>
                </div>
            </div>
        </div>
    `;
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

