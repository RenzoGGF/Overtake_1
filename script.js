function mostrarFormulario(tabla) {
    const contenido = document.getElementById("contenido");

    let html = `<h2>Agregar a ${tabla}</h2><form id="formulario">`;

    if (tabla === 'categorias') {
        html += `<input type="text" name="nombre" placeholder="Nombre de categoría" required>`;
        html += `<input type="text" name="descripcion" placeholder="Descripción" required>`;
    } else if (tabla === 'clientes') {
        html += `<input type="text" name="nombre" placeholder="Nombre" required>`;
        html += `<input type="email" name="email" placeholder="Email" required>`;
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