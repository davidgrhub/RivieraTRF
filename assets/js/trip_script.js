document.addEventListener('DOMContentLoaded', () => {
    // Variables de elementos HTML
    const onewayButton = document.getElementById('oneway__button');
    const roundtripButton = document.getElementById('roundtrip__button');
    const returnfilter = document.getElementById('return-bookingengine-filter__container');

    // Comprobamos que los contendores existan
    if (!onewayButton || !roundtripButton || !returnfilter) {
        console.error('No se encontraron los elementos necesarios en el DOM.');
        return;
    }

    // Función que recibe un booleano para decidir el estado y cambiar los estilos
    const toggleStyles = (isOneway) => {
        // Estilos para el contenedor oneway
        onewayButton.style.backgroundColor = isOneway ? 'var(--accent-ligth)' : 'var(--background-light)';
        onewayButton.style.color = isOneway ? 'var(--text-dark)' : 'var(--text-ligth)';
        // Agregar el atributo data-act con el valor booleano convertido a string
        onewayButton.setAttribute('data-active', isOneway.toString());

        // Estilos para el contenedor roundtrip
        roundtripButton.style.backgroundColor = isOneway ? 'var(--background-light)' : 'var(--accent-ligth)';
        roundtripButton.style.color = isOneway ? 'var(--text-ligth)' : 'var(--text-dark)';
        // Para roundtrip asignamos el valor contrario
        roundtripButton.setAttribute('data-active', (!isOneway).toString());

        // Estilos para el filtro de return
        returnfilter.style.display = isOneway ? 'none' : 'flex';
    };

    // Asignar valores predefinidos al cargar la página:
    // Queremos que, al iniciar, roundtrip tenga data-act="true" y oneway tenga data-act="false".
    // Entonces, llamamos toggleStyles(false)
    toggleStyles(false);

    // Eventos de click para cambiar estilos
    onewayButton.addEventListener('click', () => toggleStyles(true));
    roundtripButton.addEventListener('click', () => toggleStyles(false));
});