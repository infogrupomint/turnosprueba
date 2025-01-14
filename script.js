// Conectamos Firestore
const db = firebase.firestore();

// Datos de los turnos
let turnos = [];

// Cargar los turnos desde Firebase
function cargarTurnos() {
    const contenedorTurnos = document.getElementById('turnos-disponibles');
    contenedorTurnos.innerHTML = '';

    // Consultar la colección de turnos
    db.collection("turnos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const turno = doc.data();
            const turnoElemento = document.createElement('div');
            turnoElemento.classList.add('turno');
            
            if (turno.reservado) {
                turnoElemento.classList.add('reservado');
            } else {
                turnoElemento.classList.add('disponible');
                turnoElemento.addEventListener('click', () => reservarTurno(doc.id));
            }
            
            turnoElemento.textContent = turno.hora;
            contenedorTurnos.appendChild(turnoElemento);
        });
    });
}

// Reservar un turno
function reservarTurno(id) {
    // Referencia al turno en Firestore
    const turnoRef = db.collection("turnos").doc(id);

    turnoRef.get().then((doc) => {
        if (doc.exists) {
            const turno = doc.data();
            if (!turno.reservado) {
                // Actualizar el turno como reservado
                turnoRef.update({
                    reservado: true
                }).then(() => {
                    alert(`¡Turno reservado para las ${turno.hora}!`);
                    cargarTurnos();  // Recargar los turnos
                }).catch((error) => {
                    console.error("Error al reservar el turno: ", error);
                });
            } else {
                alert('Este turno ya ha sido reservado.');
            }
        } else {
            console.log("No se encuentra el turno.");
        }
    });
}

// Inicializar la carga de turnos cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarTurnos);
