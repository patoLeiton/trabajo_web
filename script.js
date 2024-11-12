// Obtener los elementos de la barra de búsqueda
const searchButton = document.querySelector('.search-bar button');
const inputs = document.querySelectorAll('.search-bar input');

// Agregar evento al botón
searchButton.addEventListener('click', () => {
  const values = Array.from(inputs).map(input => input.value.trim());
  
  // Validar que todos los campos estén llenos
  if (values.some(value => value === '')) {
    alert('Por favor completa todos los campos antes de buscar.');
  } else {
    console.log('Datos de búsqueda:', {
      lugar: values[0],
      checkIn: values[1],
      checkOut: values[2],
      viajeros: values[3],
    });
    // Aquí podrías redirigir a otra página o realizar la búsqueda.
  }
});
