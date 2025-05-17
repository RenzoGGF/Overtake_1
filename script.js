document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button[data-tabla]").forEach(button => {
        button.addEventListener("click", () => {
            const tabla = button.dataset.tabla;
            if (button.textContent.includes("Agregar")) {
                mostrarFormulario(tabla);
            } else {
                mostrarTabla(tabla);
            }
        });
    });
});

function mostrarTabla(tabla) {
    const contenido = document.getElementById("contenido");

    fetch(`obtener_tabla.php?tabla=${tabla}`)
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                contenido.innerHTML = "<p>No hay datos disponibles.</p>";
                return;
            }

            let html = `<h2>${tabla}</h2><table><thead><tr>`;
            Object.keys(data[0]).forEach(columna => html += `<th>${columna}</th>`);
            html += `</tr></thead><tbody>`;

            data.forEach(fila => {
                html += `<tr>`;
                Object.values(fila).forEach(valor => html += `<td>${valor}</td>`);
                html += `</tr>`;
            });

            html += `</tbody></table>`;
            contenido.innerHTML = html;
        })
        .catch(() => contenido.innerHTML = "<p>Error al obtener datos.</p>");
}

function mostrarFormulario(tabla) {
    const contenido = document.getElementById("contenido");
    const campos = {
        categorias: ["nombre", "descripcion"],
        clientes: ["nombre", "email", "telefono", "direccion"],
        productos: ["nombre", "descripcion", "precio", "stock", "categoria"],
        pedidos: ["id_cliente", "fecha_pedido", "total", "estado", "id_pago"]
    };

    let html = `<h2>Agregar datos a ${tabla}</h2><form id="formulario">`;
    campos[tabla].forEach(campo => {
        html += `<input type="text" name="${campo}" placeholder="${campo.replace('_', ' ').toUpperCase()}" required>`;
    });

    html += `<button type="submit">Enviar</button></form>`;
    contenido.innerHTML = html;

    document.getElementById("formulario").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("tabla", tabla);

        try {
            const response = await fetch("insertar_datos.php", { method: "POST", body: formData });
            const data = await response.text();
            contenido.innerHTML = `<p>${data}</p>`;
        } catch {
            contenido.innerHTML = "<p>Error al enviar datos.</p>";
        }
    });
}