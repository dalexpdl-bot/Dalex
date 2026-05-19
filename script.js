let carrito = [];
let total = 0;

// --- FUNCIONES DE INTERFAZ PARA EL DISEÑO NUEVO ---

/**
 * Actualiza el texto descriptivo del aroma en la tarjeta cuando el usuario hace clic en los iconos.
 * Esta función es necesaria para que el usuario vea qué aroma tiene seleccionado.
 */
function actualizarTextoAroma(aroma) {
    const displayNombre = document.getElementById('nombre-aroma');
    if (displayNombre) {
        displayNombre.innerText = aroma;
    }
}

// --- LÓGICA DEL CARRITO (Tus funciones originales mejoradas) ---

/**
 * Especial para el Multiusos: Obtiene el aroma de los radio buttons 
 * y lo combina con el tamaño seleccionado.
 */
function agregarMultiusos(presentacion, precio) {
    // Buscamos cuál de los botones de aroma está seleccionado
    const aromaSeleccionado = document.querySelector('input[name="aroma"]:checked').value;
    
    // Creamos el nombre completo del producto
    let nombreCompleto = `Multiusos ${aromaSeleccionado} (${presentacion})`;
    
    // Lo mandamos a la función principal del carrito
    agregarAlCarrito(nombreCompleto, precio);
}

/**
 * Agrega cualquier producto al arreglo y actualiza la vista.
 */
function agregarAlCarrito(producto, precio) {
    carrito.push({ nombre: producto, precio: precio });
    actualizarInterfaz();
    
    // Opcional: Feedback visual de que se agregó
    console.log(`Agregado: ${producto} - $${precio}`);
}

/**
 * Actualiza el contador circular y la lista dentro del modal.
 */
function actualizarInterfaz() {
    // Actualizar el número del círculo azul/verde
    const conteoElemento = document.getElementById('carrito-conteo');
    if (conteoElemento) {
        conteoElemento.innerText = carrito.length;
    }
    
    let listaHTML = "";
    total = 0; 

    carrito.forEach((item, index) => {
        total += item.precio;
        listaHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <div style="text-align: left;">
                    <strong style="display: block; font-size: 0.9rem;">${item.nombre}</strong>
                    <span style="color: #666;">$${item.precio}</span>
                </div>
                <span onclick="eliminarDelCarrito(${index})" style="color: #a4161a; cursor: pointer; font-weight: bold; font-size: 0.8rem; background: #ffeeef; padding: 5px 10px; border-radius: 8px;"> Quitar </span>
            </div>`;
    });

    if (carrito.length === 0) {
        listaHTML = "<p style='text-align:center; color:#888; padding: 20px;'>Tu carrito está vacío</p>";
    }

    document.getElementById('lista-carrito').innerHTML = listaHTML;
    document.getElementById('total-carrito').innerText = total;
}

/**
 * Elimina un producto específico por su posición en el arreglo.
 */
function eliminarDelCarrito(index) {
    carrito.splice(index, 1); 
    actualizarInterfaz(); 
}

// --- FUNCIONES DEL MODAL ---

function mostrarModal() {
    document.getElementById('modal-carrito').style.display = "block";
}

function cerrarModal() {
    document.getElementById('modal-carrito').style.display = "none";
}

// Cerrar modal si el usuario hace clic fuera del cuadro blanco
window.onclick = function(event) {
    let modal = document.getElementById('modal-carrito');
    if (event.target == modal) {
        cerrarModal();
    }
}

// --- ENVÍO A WHATSAPP ---

function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("Agrega productos antes de enviar el pedido");
        return;
    }

    let mensaje = "Hola Dalex! Me gustaría hacer el siguiente pedido:%0A%0A";
    
    carrito.forEach(item => {
        mensaje += `• ${item.nombre} ($${item.precio})%0A`;
    });
    
    mensaje += `%0A*Total a pagar: $${total}*`;
    
    // Tu número configurado (Juárez)
    let telefono = "526568169707"; 
    
    let url = "https://api.whatsapp.com/send?phone=" + telefono + "&text=" + mensaje;
    
    window.open(url, '_blank');
}
