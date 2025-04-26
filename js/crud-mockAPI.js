const d = document;

const $tablaDatos = d.querySelector('.tabla-datos'),
  $cuerpoTablaDatos = d.querySelector('.cuerpo-tabla-datos')
  $indicePagina = d.querySelector('.indice-pagina'),
  $crudFormulario = d.querySelector('.crud-formulario'),
  $tituloFormulario = d.querySelector('.titulo-formulario'),
  $seccionTabla = document.querySelector("#datos");
  $seccionFormulario = document.querySelector("#formulario");
  $fragmento = d.createDocumentFragment();



// variables manejadoras de paginas
let paginas = 1;
let ultimapagina = 0;

// objetos de end poins necesarios
const apiEndPoins = {
  apiBase: `https://67f2d5a2ec56ec1a36d456f2.mockapi.io/usuarios`,
  apiBasePaginas: () => `https://67f2d5a2ec56ec1a36d456f2.mockapi.io/usuarios?page=${paginas}&limit=10`,
  apiBaseEspecifica: (id) => `https://67f2d5a2ec56ec1a36d456f2.mockapi.io/usuarios/${id}`
};


// funcion obtener datos usuarios
const getDatosUsuarios = async () => {
  try {
    let res = await fetch(apiEndPoins.apiBase);
    let resPaginas = await fetch(apiEndPoins.apiBasePaginas(paginas));

    if (!resPaginas.ok) {
      throw new Error(`Error HTTP: ${resPaginas.status} -- ${resPaginas.statusText}`);
    }

    let jsonUsuarios = await res.json();

    let totalUsuarios = jsonUsuarios.length;
    ultimapagina = Math.ceil(totalUsuarios / 10);

    let jsonUsuariosPagina = await resPaginas.json();

    // Limpiar el contenedor antes de agregar nuevos elementos
    $cuerpoTablaDatos.innerHTML = '';

    jsonUsuariosPagina.forEach(el => {

      // Creamos elementos de la tabla
      const $tr = d.createElement('tr'),
        $tdId = d.createElement('td'),
        $tdNombre = d.createElement('td'),
        $tdCorreo = d.createElement('td'),
        $tdPais = d.createElement('td'),
        $tdVehivulo = d.createElement('td'),
        $btnEditar = d.createElement('button');
        $btnEliminar = d.createElement('button'),

      // Asignamos valores a los elementos de la tabla
      $tdId.textContent = el.id;
      $tdNombre.textContent = el.nombre;
      $tdCorreo.textContent = el.email;
      $tdPais.textContent = el.pais;
      $tdVehivulo.textContent = el.tipoVehiculo;

      // Asigamos valores a los botones de la tabla
      $btnEditar.textContent = '🔨';
      $btnEditar.classList.add('editar')
      $btnEditar.setAttribute('data-id', `${el.id}`);
      $btnEditar.setAttribute('data-nombre', `${el.nombre}`);
      $btnEditar.setAttribute('data-email', `${el.email}`);
      $btnEditar.setAttribute('data-pais', `${el.pais}`);
      $btnEditar.setAttribute('data-tipoVehiculo', `${el.tipoVehiculo}`);

      $btnEliminar.textContent = '❌';
      $btnEliminar.classList.add('eliminar')
      $btnEliminar.setAttribute('data-id', `${el.id}`);
      $btnEliminar.setAttribute('data-nombre', `${el.nombre}`);
      $btnEliminar.setAttribute('data-email', `${el.email}`);
      $btnEliminar.setAttribute('data-pais', `${el.pais}`);
      $btnEliminar.setAttribute('data-tipoVehiculo', `${el.tipoVehiculo}`);

      // Asignamos cada elemento a una fila
      $tr.appendChild($tdId);
      $tr.appendChild($tdNombre);
      $tr.appendChild($tdCorreo);
      $tr.appendChild($tdPais);
      $tr.appendChild($tdVehivulo);
      $tr.appendChild($btnEditar);
      $tr.appendChild($btnEliminar);

      // Cargamos el fragmento con los elementos de la tabla
      $fragmento.appendChild($tr);
      // Agregamos el fragmento al cuerpo de la tabla
      $cuerpoTablaDatos.appendChild($fragmento);
    });

  } catch (error) {
    $tablaDatos.textContent = `Error al obtener los datos de usuarios: ${error.message}`
  }
}

d.addEventListener('DOMContentLoaded', getDatosUsuarios);




// metodos post y put
d.addEventListener('submit', (e) => {

  if (e.target === $crudFormulario) {
    e.preventDefault();

      // Si no hay un ID, significa que estamos creando un nuevo usuario
    if (!e.target.id.value) {
      // funcion para crear un nuevo usuario
      const crearDatosUsuario = async () => {
        const datos = {
          nombre: e.target.nombre.value,
          email: e.target.email.value,
          pais: e.target.pais.value,
          tipoVehiculo: e.target.vehiculo.value,
        }

        const res = await fetch(apiEndPoins.apiBase, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos)
        });
      }
      crearDatosUsuario();
      e.target.reset();
      getDatosUsuarios();
      alert('EL USUARIO FUE CREADO');
      $seccionTabla.scrollIntoView({ behavior: "smooth" }); // SCROLL HACIA LA TABLA

    } else {

      // funcion para actualizar un usuario existente
      const ActualizarDatosUsuario = async () => {
        // Datos a enviar
        const datos = {
          nombre: e.target.nombre.value,
          email: e.target.email.value,
          pais: e.target.pais.value,
          tipoVehiculo: e.target.vehiculo.value,
        }

        const res = await fetch(apiEndPoins.apiBaseEspecifica(e.target.id.value), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos)
        });
      }
      ActualizarDatosUsuario();
      e.target.reset();
      alert(`Datos del usuario ${e.target.id.value} fueron actualizado`);
      $crudFormulario.id.value = ''; // LIMPIAMOS EL ID
      $tituloFormulario.textContent = 'Agregar Usuario'; // VOLVEMOS A MODO CREAR
      getDatosUsuarios();
      $seccionTabla.scrollIntoView({ behavior: "smooth" }); // SCROLL HACIA LA TABLA

    }
  }
})


// Delegación de eventos para manejar los clics en los botones de paginación y edición
d.addEventListener('click', (e) => {

  // btn pagina siguiente
  if (e.target.matches('.btn-pagina-siguiente')) {
    if (paginas < ultimapagina) {
      paginas++;
      $indicePagina.textContent = `Pagina: ${paginas}`;
      getDatosUsuarios();
    }
  }

  // btn pagina anterior
  if (e.target.matches('.btn-pagina-anterior')) {
    if (paginas > 1) {
      paginas--;
      $indicePagina.textContent = `Pagina: ${paginas}`;
      getDatosUsuarios();
    }
  }

  // btn editar
  if (e.target.matches('.editar')) {
    $tituloFormulario.textContent = 'Editar Usuarios';
    $crudFormulario.nombre.value = e.target.dataset.nombre;
    $crudFormulario.email.value = e.target.dataset.email;
    $crudFormulario.pais.value = e.target.dataset.pais;
    $crudFormulario.vehiculo.value = e.target.dataset.tipovehiculo;
    $crudFormulario.id.value = e.target.dataset.id;
    $seccionFormulario.scrollIntoView({ behavior: "smooth" }); // SCROLL HACIA EL FORMULARIO
  }

  // btn eliminar
  if (e.target.matches('.eliminar')) {
    let validarTrueOFalse = confirm(`¿Estas seguro que deseas eliminar ${e.target.dataset.nombre} ?`);

    if (validarTrueOFalse === true) {
      const eliminarDatosUsuarios = async () => {
        const res = await fetch(apiEndPoins.apiBaseEspecifica(e.target.dataset.id),
          {
            method: 'DELETE'
          });
      }
      eliminarDatosUsuarios();
      getDatosUsuarios();
    }
  }
});