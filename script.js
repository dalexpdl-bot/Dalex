let carrito = [];
let total = 0;

// --- FUNCIÓN DE ANIMACIÓN VISUAL (EL EFECTO DE VUELO) ---
function efectoVuelo(e) {
    if (!e) return;

    const particula = document.createElement('div');
    particula.classList.add('particula-vuelo');
    particula.innerText = '+1';
    
    particula.style.left = e.clientX + 'px';
    particula.style.top = e.clientY + 'px';
    document.body.appendChild(particula);
    
    const carritoIcono = document.getElementById('ver-carrito');
    const rect = carritoIcono.getBoundingClientRect();
    
    setTimeout(() => {
        particula.style.left = (rect.left + 20) + 'px';
        particula.style.top = (rect.top + 20) + 'px';
        particula.style.opacity = '0';
        particula.style.transform = 'scale(0.3)';
    }, 50);
    
    setTimeout(() => {
        particula.remove();
        carritoIcono.classList.add('animar-carrito');
        setTimeout(() => carritoIcono.classList.remove('animar-carrito'), 300);
    }, 3100); // Mantiene tus 3 segundos de vuelo
}

// --- FUNCIONES DE INTERFAZ ---
function actualizarTextoAroma(aroma) {
    const displayNombre = document.getElementById('nombre-aroma');
    if (displayNombre) {
        displayNombre.innerText = aroma;
    }
}

// --- LÓGICA DEL CARRITO ---
function agregarMultiusos(presentacion, precio) {
    const aromaSeleccionado = document.querySelector('input[name="aroma"]:checked').value;
    let nombreCompleto = `Multiusos ${aromaSeleccionado} (${presentacion})`;
    
    efectoVuelo(window.event);
    agregarAlCarrito(nombreCompleto, precio);
}

function agregarAlCarrito(producto, precio) {
    if (window.event && !producto.includes("Multiusos")) {
        efectoVuelo(window.event);
    }

    carrito.push({ nombre: producto, precio: precio });
    actualizarInterfaz();
}

function actualizarInterfaz() {
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

window.onclick = function(event) {
    let modal = document.getElementById('modal-carrito');
    if (event.target == modal) {
        cerrarModal();
    }
}

// --- ENVÍO A WHATSAPP Y REGISTRO EN HISTORIAL ---
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("Agrega productos antes de enviar el pedido");
        return;
    }

    // 1. Preparamos el resumen para el historial
    let resumenPedido = "";
    carrito.forEach(item => {
        resumenPedido += `- ${item.nombre} ($${item.precio})\n`;
    });
    resumenPedido += `\nTOTAL: $${total}`;

    // 2. ENVÍO AL HISTORIAL DE GOOGLE (Invisible para el cliente)
    const idForm = "1FAIpQLSc8DaND0M0G8TY6xiGQ7dUtEJGI0MZ-XmnFuFX8AeSTxouCZA";
    const urlForm = `https://docs.google.com/forms/d/e/${idForm}/formResponse`;
    
    const datos = new FormData();
    datos.append("entry.101865169", resumenPedido); // Tu ID de la pregunta "Pedido"

    fetch(urlForm, {
        method: "POST",
        mode: "no-cors"
    }).catch(err => console.log("Error al guardar historial"));

    // 3. ENVÍO A WHATSAPP (Lo que ve el cliente)
    let mensaje = "Hola Dalex! Me gustaría hacer el siguiente pedido:%0A%0A";
    carrito.forEach(item => {
        mensaje += `• ${item.nombre} ($${item.precio})%0A`;
    });
    mensaje += `%0A*Total a pagar: $${total}*`;
    
    let telefono = "526568169707"; 
    let url = "https://api.whatsapp.com/send?phone=" + telefono + "&text=" + mensaje;
    window.open(url, '_blank');
}