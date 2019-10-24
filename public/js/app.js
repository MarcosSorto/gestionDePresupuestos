import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  // Eliminar presupuestos
  const vacantesListado = document.querySelector(".table-responsive");

  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
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

  // verificar que el botón seleccionado es el de eliminar
  if (e.target.dataset.eliminar) {
    console.log("---------------------------------------------------------");
    console.log(e.target.dataset.eliminar);
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
        // Obtener el valor del id de la vacante
        const url = `${location.origin}/presupuesto/eliminar/${e.target.dataset.eliminar}`;

        // Axios haga la petición de eliminación
        axios
          .delete(url, { params: url })
          .then(function(respuesta) {
            if (respuesta.status == 200) {
              Swal.fire("¡Presupuesto eliminado!", respuesta.data, "success");

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
              text: " Hubo un error al momento de eliminar"
            })
          );
      }
    });
  }
};
