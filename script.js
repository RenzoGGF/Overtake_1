document.querySelectorAll('[data-tabla]').forEach(btn =>
  btn.addEventListener('click', () => mostrarTabla(btn.dataset.tabla))
);

document.querySelectorAll('[data-form]').forEach(btn =>
  btn.addEventListener('click', () => mostrarFormulario(btn.dataset.form))
);

function mostrarTabla(tabla) {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = "<p class='placeholder'>Cargando...</p>";

  fetch(`obtener_tabla.php?tabla=${tabla}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        contenido.innerHTML = `<p class="placeholder">No hay datos en "${tabla}".</p>`;
        return;
      }

      let html = `<h2>${tabla}</h2><table><thead><tr>`;
      html += Object.keys(data[0]).map(col => `<th>${col}</th>`).join('');
      html += `</tr></thead><tbody>`;
      html += data.map(row =>
        `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`
      ).join('');
      html += `</tbody></table>`;

      contenido.innerHTML = html;
    })
    .catch(() => contenido.innerHTML = "<p class='placeholder'>Error al cargar datos.</p>");
}

function mostrarFormulario(tabla) {
  const contenido = document.getElementById("contenido");

  const campos = {
    categorias: ['nombre', 'descripcion'],
    clientes: ['nombre', 'email', 'telefono', 'direccion'],
    productos: ['nombre', 'descripcion', 'precio', 'stock', 'categoria'],
    pedidos: ['id_cliente', 'fecha_pedido', 'total', 'estado', 'id_pago']
  };

  const tipos = {
    email: 'email', precio: 'number', stock: 'number', id_cliente: 'number',
    total: 'number', id_pago: 'number', fecha_pedido: 'date'
  };

  let html = `<h2>Agregar a ${tabla}</h2><form id="formulario">`;
  (campos[tabla] || []).forEach(nombre => {
    const tipo = tipos[nombre] || 'text';
    const label = nombre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    html += `<input type="${tipo}" name="${nombre}" placeholder="${label}" required />`;
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
      .catch(() => contenido.innerHTML = `<p class='placeholder'>Error al enviar datos.</p>`);
  });
}
