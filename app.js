//URLs del backend
const urlLogin = 'http://localhost:3000/api/login';
const urlInventario = 'http://localhost:3000/api/productos';

// Elementos del DOM
const formLogin = document.getElementById('form-login');
const seccionLogin = document.getElementById('login-seccion');
const panelInventario = document.getElementById('panel-inventario');
const listaBackend = document.getElementById('lista-backend');
const formProductoNuevo = document.getElementById('form-producto-nuevo');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

//INICIO DE SESIÓN
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const respuesta = await fetch(urlLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            localStorage.setItem('tokenJWT', datos.token); //Guardar token
            seccionLogin.style.display = 'none';
            panelInventario.style.display = 'block';
            cargarDatosDesdeBackend(); //Cargar productos
        } else {
            document.getElementById('error-login').style.display = 'block';
        }
    } catch (error) {
        console.error("Error al conectar con el servidor", error);
    }
});

//LEER DATOS (GET) Y MANIPULAR EL DOM
const cargarDatosDesdeBackend = async () => {
    listaBackend.innerHTML = '';
    const respuesta = await fetch(urlInventario);
    const productos = await respuesta.json();

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'item-tarea';
        li.innerHTML = `
            <span class="texto-tarea">${producto.nombre} - $${producto.precio}</span>
            
            <button class="btn-accion btn-editar" onclick="editarEnBackend(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button>
            <button class="btn-accion btn-eliminar" onclick="eliminarDelBackend(${producto.id})">Eliminar</button>
        `;
        listaBackend.appendChild(li);
    });
};

//CREAR DATO (POST)
formProductoNuevo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = document.getElementById('nuevo-precio').value;
    const token = localStorage.getItem('tokenJWT');

    await fetch(urlInventario, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nombre, descripcion: "Nuevo", precio, estado: "Disponible" })
    });

    document.getElementById('form-producto-nuevo').reset();
    cargarDatosDesdeBackend(); // Actualiza lista
});

//ELIMINAR DATO (DELETE)
window.eliminarDelBackend = async (id) => {
    const token = localStorage.getItem('tokenJWT');
    await fetch(`${urlInventario}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    cargarDatosDesdeBackend(); //Actualiza lista
};

//ACTUALIZAR DATO (PUT)
window.editarEnBackend = async (id, nombreActual, precioActual) => {
    // Pedimos al usuario los nuevos datos
    const nuevoNombre = prompt('Editar el nombre del producto:', nombreActual);
    const nuevoPrecio = prompt('Editar el precio del producto:', precioActual);

    // Validamos que no deje los campos vacíos
    if (nuevoNombre && nuevoPrecio && nuevoNombre.trim() !== '' && nuevoPrecio.trim() !== '') {
        const token = localStorage.getItem('tokenJWT');
        
        try {
            await fetch(`${urlInventario}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                //Mantenemos la descripción y el estado por defecto para simplificar
                body: JSON.stringify({ 
                    nombre: nuevoNombre.trim(), 
                    descripcion: "Actualizado desde el panel", 
                    precio: parseFloat(nuevoPrecio), 
                    estado: "Disponible" 
                })
            });
            cargarDatosDesdeBackend(); //Actualiza lista con los cambios
        } catch (error) {
            console.error("Error al actualizar el producto", error);
        }
    } else {
        alert('Edición cancelada o datos inválidos. El nombre y precio son obligatorios.');
    }
};

//CERRAR SESIÓN
btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('tokenJWT');
    panelInventario.style.display = 'none';
    seccionLogin.style.display = 'block';
    formLogin.reset();
});