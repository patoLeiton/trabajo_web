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
    


   