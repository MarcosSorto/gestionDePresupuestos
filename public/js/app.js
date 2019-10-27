import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  // Eliminar presupuestos
  const categoriaYPresupuestosListado = document.querySelector(
    ".table-responsive"
  );

  if (categoriaYPresupuestosListado) {
    categoriaYPresupuestosListado.addEventListener("click", accionesListado);
  }
});

const limpiarAlertas = alertas => {
  // Verificar si el div alertas tiene hijos
  const interval = setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    } else {
      alertas.parentElement.removeChild(alertas);
      clearInterval(interval);
    }
  }, 3000);
};

const accionesListado = e => {
  // Prevenir el comportamiento por defecto
  // e.preventDefault();

  // verificar que el botón eliminar presupuesto sea el seleccionado.
  if (e.target.dataset.eliminar) {
    Swal.fire({
      title: "¿Está seguro de eliminar su presupuesto?",
      text: "No podrá recuperarlo si lo elimina",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.value) {
        // Obtener el valor del id del presupuesto
        const url = `${location.origin}/presupuesto/eliminar/${e.target.dataset.eliminar}`;

        // Axios haga la petición de eliminación
        axios
          .delete(url, { params: url })
          .then(function(respuesta) {
            if (respuesta.status == 200) {
              Swal.fire("¡Presupuesto eliminado!", respuesta.data, "success");

              // Eliminar el presupuesto seleccionada del DOM
              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch(() =>
            Swal.fire({
              type: "error",
              title: "Error",
              text: " Hubo un error al momento de eliminar"
            })
          );
      }
    });
  }

  // verificamos que elboton inhabilitar categoria sea el seleccionado
  if (e.target.dataset.inhabilitar) {
    Swal.fire({
      title: "¿Está seguro que desea inhabilitar la categoria?",
      text: "No podrá usarla hasta que la habilite",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Inhabilitar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.value) {
        // Obtener el valor del url de la categoria  :url
        const url = `${location.origin}/categorias/inhabilitarcategoria/${e.target.dataset.inhabilitar}`;

        // Axios haga la petición de inhabilitación
        axios
          .post(url, { params: url })
          .then(function(respuesta) {
            if (respuesta.status == 200) {
              Swal.fire("¡Categoria inhabilitada!", respuesta.data, "success");

              // Eliminar la vacante seleccionada del DOM
              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch(() =>
            Swal.fire({
              type: "error",
              title: "Error",
              text: " Hubo un error al momento de inhabilitar"
            })
          );
      }
    });
  }

  // verificamos que el boton habilitar categoria sea el seleccionado
  if (e.target.dataset.habilitar) {
    Swal.fire({
      title: "¿Está seguro que desea habilitar la categoria?",
      text: "podrás usarla nuevamente en tus presupuestos",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Habilitar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.value) {
        // Obtener el valor del url de la categoria  :url
        const url = `${location.origin}/categoria/habilitarCategoria/${e.target.dataset.habilitar}`;

        // Axios haga la petición de inhabilitación
        axios
          .post(url, { params: url })
          .then(function(respuesta) {
            if (respuesta.status == 200) {
              Swal.fire("¡Categoria habilitada!", respuesta.data, "success");

              // Eliminar la vacante seleccionada del DOM
              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch(() =>
            Swal.fire({
              type: "error",
              title: "Error",
              text: " Hubo un error al momento de habilitar"
            })
          );
      }
    });
  }
};
