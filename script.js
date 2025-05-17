function mostrarTabla(tabla) {
  const contenido = document.getElementById("contenido");

  fetch(`obtener_tabla.php?tabla=${tabla}`)
    .then(response => response.json())
    .then(data => {
      let html = `<h2>${tabla.charAt(0).toUpperCase() + tabla.slice(1)}</h2><table><tr>`;

      Object.keys(data[0]).forEach(columna => {
        html += `<th>${columna}</th>`;
      });
      html += `</tr>`;

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

  let html = `<h2>Agregar datos a ${tabla.charAt(0).toUpperCase() + tabla.slice(1)}</h2><form id="formulario">`;

  const campos = {
    categorias: ["nombre", "descripcion"],
    clientes: ["nombre", "email", "telefono", "direccion"],
    productos: ["nombre", "descripcion", "precio", "stock", "categoria"],
    pedidos: ["id_cliente", "fecha_pedido", "total", "estado", "id_pago"]
  };

  campos[tabla].forEach(campo => {
    const tipo = campo.includes("email") ? "email" : campo.includes("fecha") ? "date" : campo.includes("precio") || campo.includes("stock") || campo.includes("id") || campo.includes("total") ? "number" : "text";
    html += `<input type="${tipo}" name="${campo}" placeholder="${campo.replace(/_/g, ' ').toUpperCase()}" required>`;
  });

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
