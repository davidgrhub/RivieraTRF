document.addEventListener('DOMContentLoaded', () => {
    // Variables de elementos HTML
    const travelersInput = document.getElementById('travelers__input');
    const adultsInput = document.getElementById('adults__input');
    const childrenInput = document.getElementById('children__input');
    const travelersContainer = document.getElementById('travelers__container');
    const travelersConfigContainer = document.getElementById('travelers-configuration__container');
    const bookingengineContainer = document.getElementById('bookingengine-filter__container');
    const doneButton = document.getElementById('done-travelers__button');
    const closeButton = document.getElementById('close-travel__button');
    const minusAdultsButton = document.getElementById('minus-adults__button');
    const addAdultsButton = document.getElementById('add-adults__button');
    const minusChildrenButton = document.getElementById('minus-children__button');
    const addChildrenButton = document.getElementById('add-children__button');

    // Bloquear el input travelers para que el usuario no pueda escribir (pero sigue respondiendo a eventos)
    travelersInput.readOnly = true;
    // Bloquear (deshabilitar) los demás inputs si fuera necesario
    adultsInput.disabled = true;
    childrenInput.disabled = true;

    // Asignamos el valor inicial de los inputs
    travelersInput.value = '1 Traveler';
    travelersInput.setAttribute('data-value', '1');
    adultsInput.value = '1';
    childrenInput.value = '0';

    // Función auxiliar para actualizar el estilo de los botones
    function updateButtonStyle(button, disabled) {
        if (disabled) {
            button.style.cursor = 'not-allowed';
            // Buscamos el elemento <i> dentro del botón, si existe
            button.style.opacity = "40%"
        } else {
            button.style.cursor = 'pointer';
            button.style.opacity = '100%'
        }
    }

    // Ajuste de posición del dropdown
    const adjustDropdownPosition = () => {
        if (window.innerWidth > 1000) {
            const rect = bookingengineContainer.getBoundingClientRect();
            travelersConfigContainer.style.top = `${rect.bottom + 12}px`;
            travelersConfigContainer.style.right = `${rect.left}px`;
        }
    };

    window.addEventListener("resize", adjustDropdownPosition);
    window.addEventListener("load", adjustDropdownPosition);

    // Mostrar u ocultar el contenedor de listas
    function toggleOriginList(show) {
        travelersConfigContainer.style.display = show ? 'flex' : 'none';
    }

    // Event listener para mostrar el contenedor al hacer click en el contenedor principal
    travelersContainer.addEventListener('click', (event) => {
        if (!travelersConfigContainer.contains(event.target)) {
            adjustDropdownPosition();         
            toggleOriginList(true);
        }
    });

    // Cerrar el contenedor de listas si el usuario hace clic fuera de él y del contenedor del input
    document.addEventListener('click', (event) => {
        const isClickInsideList = travelersConfigContainer.contains(event.target);
        const isClickInsideInput = travelersContainer.contains(event.target);
        const isCloseButton = closeButton.contains(event.target);

        if (!isClickInsideList && !isClickInsideInput) {
            toggleOriginList(false);
        }
        if (isCloseButton) {
            toggleOriginList(false);
        }
    });

    // Función para actualizar el estado de los botones
    function updateButtons() {
        const adultsVal = parseInt(adultsInput.value, 10);
        const childrenVal = parseInt(childrenInput.value, 10);
        const total = adultsVal + childrenVal;

        // Para los botones de "agregar"
        const disableAdd = total >= 15;
        updateButtonStyle(addAdultsButton, disableAdd);
        updateButtonStyle(addChildrenButton, disableAdd);

        // Para el botón de "restar" adultos: siempre al menos 1 adulto
        updateButtonStyle(minusAdultsButton, adultsVal <= 1);

        // Para el botón de "restar" niños: deshabilitar si es 0
        updateButtonStyle(minusChildrenButton, childrenVal <= 0);
    }

    // Actualizamos los botones al inicio
    updateButtons();

    // Eventos para el botón de agregar adultos
    addAdultsButton.addEventListener('click', () => {
        let adultsVal = parseInt(adultsInput.value, 10);
        let childrenVal = parseInt(childrenInput.value, 10);
        if (adultsVal + childrenVal < 15) {
            adultsVal++;
            adultsInput.value = adultsVal;
        }
        updateButtons();
    });

    // Eventos para el botón de restar adultos
    minusAdultsButton.addEventListener('click', () => {
        let adultsVal = parseInt(adultsInput.value, 10);
        if (adultsVal > 1) {
            adultsVal--;
            adultsInput.value = adultsVal;
        }
        updateButtons();
    });

    // Eventos para el botón de agregar niños
    addChildrenButton.addEventListener('click', () => {
        let adultsVal = parseInt(adultsInput.value, 10);
        let childrenVal = parseInt(childrenInput.value, 10);
        if (adultsVal + childrenVal < 15) {
            childrenVal++;
            childrenInput.value = childrenVal;
        }
        updateButtons();
    });

    // Eventos para el botón de restar niños
    minusChildrenButton.addEventListener('click', () => {
        let childrenVal = parseInt(childrenInput.value, 10);
        if (childrenVal > 0) {
            childrenVal--;
            childrenInput.value = childrenVal;
        }
        updateButtons();
    });

    // Actualizar travelersInput solo cuando el usuario haga click en el botón done
    doneButton.addEventListener('click', () => {
        const adultsVal = parseInt(adultsInput.value, 10);
        const childrenVal = parseInt(childrenInput.value, 10);
        const total = adultsVal + childrenVal;

        if (total > 1) {
            travelersInput.value = `${total} Travelers`;
        } else {
            travelersInput.value = `${total} Traveler`;
        }
        travelersInput.setAttribute('data-value', total);

        // Ocultar el contenedor de configuración
        toggleOriginList(false);
    });
});