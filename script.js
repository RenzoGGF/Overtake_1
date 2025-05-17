document.querySelectorAll('[data-tabla]').forEach(button => {
  button.addEventListener('click', () => mostrarTabla(button.dataset.tabla));
});

document.querySelectorAll('[data-form]').forEach(button => {
  button.addEventListener('click', () => mostrarFormulario(button.dataset.form));
});

function mostrarTabla(tabla) {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = "<p>Cargando datos...</p>";

  fetch(`obtener_tabla.php?tabla=${tabla}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        contenido.innerHTML = `<p>No hay datos disponibles en "${tabla}".</p>`;
        return;
      }

      let html = `<h2>${tabla}</h2><table><thead><tr>`;
      Object.keys(data[0]).forEach(col => html += `<th>${col}</th>`);
      html += `</tr></thead><tbody>`;
      data.forEach(row => {
        html += `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`;
      });
      html += `</tbody></table>`;
      contenido.innerHTML = html;
    })
    .catch(() => contenido.innerHTML = "<p>Error al obtener datos.</p>");
}

function mostrarFormulario(tabla) {
  const contenido = document.getElementById("contenido");
  const campos = {
    categorias: [
      { name: 'nombre', placeholder: 'Nombre de la categoría' },
      { name: 'descripcion', placeholder: 'Descripción' }
    ],
    clientes: [
      { name: 'nombre', placeholder: 'Nombre completo' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'telefono', placeholder: 'Teléfono' },
      { name: 'direccion', placeholder: 'Dirección' }
    ],
    productos: [
      { name: 'nombre', placeholder: 'Nombre del producto' },
      { name: 'descripcion', placeholder: 'Descripción' },
      { name: 'precio', placeholder: 'Precio', type: 'number' },
      { name: 'stock', placeholder: 'Stock', type: 'number' },
      { name: 'categoria', placeholder: 'Categoría' }
    ],
    pedidos: [
      { name: 'id_cliente', placeholder: 'ID Cliente', type: 'number' },
      { name: 'fecha_pedido', placeholder: 'Fecha del pedido', type: 'date' },
      { name: 'total', placeholder: 'Total', type: 'number' },
      { name: 'estado', placeholder: 'Estado' },
      { name: 'id_pago', placeholder: 'ID Método de Pago', type: 'number' }
    ]
  };

  let html = `<h2>Agregar a ${tabla}</h2><form id="formulario">`;
  (campos[tabla] || []).forEach(({ name, placeholder, type = 'text' }) => {
    html += `<input type="${type}" name="${name}" placeholder="${placeholder}" required />`;
  });
  html += `<button type="submit">Enviar</button></form>`;
  contenido.innerHTML = html;

  document.getElementById("formulario").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("tabla", tabla);

    fetch("insertar_datos.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(msg => contenido.innerHTML = `<p>${msg}</p>`)
      .catch(() => contenido.innerHTML = `<p>Error al enviar datos.</p>`);
  });
}
