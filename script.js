document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const formButtons = document.querySelectorAll('.main-nav .btn');
    const tableButtons = document.querySelectorAll('.actions .btn');

    formButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formType = button.dataset.form;
            mostrarFormulario(formType, contentDiv);
        });
    });

    tableButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tableType = button.dataset.table;
            mostrarTabla(tableType, contentDiv);
        });
    });
});

async function mostrarTabla(tabla, contenedor) {
    try {
        const response = await fetch(`obtener_tabla.php?tabla=${tabla}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let html = `<h2>${tabla}</h2><div class="table-responsive"><table><thead><tr>`;

        if (data && data.length > 0) {
            Object.keys(data[0]).forEach(columna => {
                html += `<th>${columna}</th>`;
            });
            html += `</tr></thead><tbody>`;

            data.forEach(fila => {
                html += `<tr>`;
                Object.values(fila).forEach(valor => {
                    html += `<td>${valor}</td>`;
                });
                html += `</tr>`;
            });

            html += `</tbody></table></div>`;
        } else {
            html = `<p>No hay datos disponibles para ${tabla}.</p>`;
        }
        contenedor.innerHTML = html;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        contenedor.innerHTML = `<p class="error-message">Error al obtener datos.</p>`;
    }
}

function mostrarFormulario(tabla, contenedor) {
    let html = `<h2>Agregar datos a ${tabla}</h2><form id="data-form">`;
    let fields = [];

    switch (tabla) {
        case 'categorias':
            fields = [
                { name: 'nombre', type: 'text', placeholder: 'Nombre de la categoría' },
                { name: 'descripcion', type: 'text', placeholder: 'Descripción' }
            ];
            break;
        case 'clientes':
            fields = [
                { name: 'nombre', type: 'text', placeholder: 'Nombre completo' },
                { name: 'email', type: 'email', placeholder: 'Email' },
                { name: 'telefono', type: 'text', placeholder: 'Teléfono' },
                { name: 'direccion', type: 'text', placeholder: 'Dirección' }
            ];
            break;
        case 'productos':
            fields = [
                { name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
                { name: 'descripcion', type: 'text', placeholder: 'Descripción' },
                { name: 'precio', type: 'number', placeholder: 'Precio' },
                { name: 'stock', type: 'number', placeholder: 'Stock' },
                { name: 'categoria', type: 'text', placeholder: 'Categoría' }
            ];
            break;
        case 'pedidos':
            fields = [
                { name: 'id_cliente', type: 'number', placeholder: 'ID Cliente' },
                { name: 'fecha_pedido', type: 'date' },
                { name: 'total', type: 'number', placeholder: 'Total' },
                { name: 'estado', type: 'text', placeholder: 'Estado' },
                { name: 'id_pago', type: 'number', placeholder: 'ID Método de Pago' }
            ];
            break;
        default:
            html = `<p>Formulario no definido para ${tabla}.</p>`;
            contenedor.innerHTML = html;
            return;
    }

    fields.forEach(field => {
        html += `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" required>`;
    });

    html += `<button type="submit">Enviar</button></form>`;
    contenedor.innerHTML = html;

    const form = document.getElementById('data-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            formData.append("tabla", tabla);

            try {
                const response = await fetch("insertar_datos.php", {
                    method: "POST",
                    body: formData
                });
                const data = await response.text();
                contenedor.innerHTML = `<p class="success-message">${data}</p>`;
                form.reset(); // Limpiar el formulario después del envío
            } catch (error) {
                console.error("Error al insertar datos:", error);
                contenedor.innerHTML = `<p class="error-message">Error al insertar datos.</p>`;
            }
        });
    }
}