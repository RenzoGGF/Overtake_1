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