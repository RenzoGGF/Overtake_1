function mostrarTabla(tabla) {
    const contenido = document.getElementById("contenido");

    fetch(`obtener_tabla.php?tabla=${tabla}`)
        .then(response => response.json())
        .then(data => {
            let html = `<h2>${tabla}</h2><table border='1'><tr>`;

            // Agregar nombres de columnas
            Object.keys(data[0]).forEach(columna => {
                html += `<th>${columna}</th>`;
            });
            html += `</tr>`;

            // Agregar filas con datos
            data.forEach(fila => {
                html += `<tr>`;
                Object.values(fila).forEach(valor => {
                    html += `<td>${valor}</td>`;
                });
                html += `</tr>`;
            });

            html += `</table>`;
            contenido.innerHTML = html;
        })
        .catch(() => contenido.innerHTML = "<p>Error al obtener datos.</p>");
}

function mostrarFormulario(tabla) {
    const contenido = document.getElementById("contenido");

    let html = `<h2>Agregar datos a ${tabla}</h2><form id="formulario">`;

    if (tabla === 'categorias') {
        html += `<input type="text" name="nombre" placeholder="Nombre de la categoría" required>`;
        html += `<input type="text" name="descripcion" placeholder="Descripción" required>`;
    } else if (tabla === 'clientes') {
        html += `<input type="text" name="nombre" placeholder="Nombre completo" required>`;
        html += `<input type="email" name="email" placeholder="Email" required>`;
        html += `<input type="text" name="telefono" placeholder="Teléfono" required>`;
        html += `<input type="text" name="direccion" placeholder="Dirección" required>`;
    } else if (tabla === 'productos') {
        html += `<input type="text" name="nombre" placeholder="Nombre del producto" required>`;
        html += `<input type="text" name="descripcion" placeholder="Descripción" required>`;
        html += `<input type="number" name="precio" placeholder="Precio" required>`;
        html += `<input type="number" name="stock" placeholder="Stock" required>`;
        html += `<input type="text" name="categoria" placeholder="Categoría" required>`;
    } else if (tabla === 'pedidos') {
        html += `<input type="number" name="id_cliente" placeholder="ID Cliente" required>`;
        html += `<input type="date" name="fecha_pedido" required>`;
        html += `<input type="number" name="total" placeholder="Total" required>`;
        html += `<input type="text" name="estado" placeholder="Estado" required>`;
        html += `<input type="number" name="id_pago" placeholder="ID Método de Pago" required>`;
    }

    html += `<button type="submit">Enviar</button></form>`;
    contenido.innerHTML = html;

    document.getElementById("formulario").addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("tabla", tabla);

        fetch("insertar_datos.php", {
            method: "POST",
            body: formData
        }).then(response => response.text())
          .then(data => contenido.innerHTML = `<p>${data}</p>`);
    });
}

function mostrarTabla(tabla) {
    const contenido = document.getElementById("contenido");

    fetch(`obtener_tabla.php?tabla=${tabla}`)
        .then(response => response.json())
        .then(data => {
            let html = `<h2>${tabla}</h2><table border='1'><tr>`;

            // Agregar nombres de columnas
            Object.keys(data[0]).forEach(columna => {
                html += `<th>${columna}</th>`;
            });
            html += `</tr>`;

            // Agregar filas con datos
            data.forEach(fila => {
                html += `<tr>`;
                Object.values(fila).forEach(valor => {
                    html += `<td>${valor}</td>`;
                });
                html += `</tr>`;
            });

            html += `</table>`;
            contenido.innerHTML = html;
        })
        .catch(() => contenido.innerHTML = "<p>Error al obtener datos.</p>");
}