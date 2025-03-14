document.addEventListener('DOMContentLoaded', () => {
    // Variables de elementos HTML
    const destinationContainer = document.getElementById('to-filter__container');
    const desktopInput = document.getElementById('to__input');
    const mobileInput = document.getElementById('mobile-to__input');
    const originInput = document.getElementById('from__input');
    const destiantionListContainer = document.getElementById('to-configuration__container');
    const destinationDownSVG = document.getElementById('to-icondown__container');
    const airportzoneBlock = document.getElementById('airport-and-zone-list__to-contianer');
    const airportListContainer = document.getElementById('aiport-list-autogenerate__to-container');
    const airportBlock = document.getElementById('airport-list__to-container');
    const zoneListContainer = document.getElementById('zone-list-autogenerate__to-container');
    const zoneBlock = document.getElementById('zone-list__to-container');
    const hotelListContainer = document.getElementById('hotels-list-autogenerate__to-contianer');
    const hotelBlock = document.getElementById('hotels-list__to-contianer');
    const bookingengieContainer = document.getElementById('bookingengine-filter__container');
    const noResults = document.getElementById('no-results-message__to-container');
    const noOrigin = document.getElementById('select-origin-first');
    const destinationFiltContainer = document.getElementById('to-filter__input-container');
    const closeButton = document.getElementById('to-close__button');

    let originalData = []; // Almacenará los datos originales

    // Evitar que el input de escritorio reciba foco en móviles
    desktopInput.addEventListener('focus', (event) => {
        if (window.innerWidth < 1000) {
            event.preventDefault();
            mobileInput.focus();
            desktopInput.blur();
        }
    });

    desktopInput.addEventListener('click', (event) => {
        if (window.innerWidth < 1000) {
            event.preventDefault();
            mobileInput.focus();
        }
    });

    // Función para obtener el input activo según el ancho de la pantalla
    function getActiveInput() {
        return window.innerWidth < 1000 ? mobileInput : desktopInput;
    }

    // Función para establecer atributos en el input
    function setInputAttributes(input, item) {
        input.value = item.name;
        Object.keys(item).forEach(key => {
            input.setAttribute(`data-${key}`, item[key]);
        });
        // Se elimina el borde de error al asignar la opción
        removeErrorStyleDestination();
    }

    // Función para normalizar texto (sin mayúsculas ni acentos)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remueve acentos
    };

    // Función para actualizar las listas filtradas usando el input activo
    const filterLists = () => {
        const query = normalizeText(getActiveInput().value);

        if (query.length < 3) {
            // Si el texto tiene menos de 3 caracteres, restauramos las listas originales
            updateAllLists(originalData);
            return;
        }

        const filteredAirports = originalData.filter(
            (item) => item.class === 'Airport' && normalizeText(item.name).includes(query)
        );

        const filteredZones = originalData.filter(
            (item) => item.class === 'Zone' && normalizeText(item.name).includes(query)
        );

        const filteredHotels = originalData.filter(
            (item) =>
                item.class === 'Hotel' &&
                (normalizeText(item.name).includes(query) || normalizeText(item.zone).includes(query))
        );

        // Actualizamos las listas con los datos filtrados
        updateList(airportListContainer, filteredAirports);
        updateList(zoneListContainer, filteredZones);
        updateList(hotelListContainer, filteredHotels);

        // Mostramos u ocultamos los contenedores según los resultados
        airportBlock.style.display = filteredAirports.length > 0 ? 'flex' : 'none';
        zoneBlock.style.display = filteredZones.length > 0 ? 'flex' : 'none';
        airportzoneBlock.style.display = (filteredAirports.length > 0 || filteredZones.length > 0) ? 'flex' : 'none';
        hotelBlock.style.width = (filteredAirports.length > 0 || filteredZones.length > 0) ? '50%' : '100%';
        hotelBlock.style.display = filteredHotels.length > 0 ? 'flex' : 'none';

        // Mensaje de no resultados
        noResults.style.display = (filteredAirports.length === 0 && filteredZones.length === 0 && filteredHotels.length === 0) ? 'flex' : 'none';
    };

    // Función para actualizar una lista
    const updateList = (container, items) => {
        const title = container.querySelector('p'); // Mantener el título
        container.innerHTML = '';
        if (title) container.appendChild(title);
        items.forEach(item => container.appendChild(createListItem(item)));
    };

    // Actualizar todas las listas
    const updateAllLists = (data) => {
        const airportItems = data.filter(item => item.class === 'Airport');
        const zoneItems = data.filter(item => item.class === 'Zone');
        const hotelItems = data.filter(item => item.class === 'Hotel');

        updateList(airportListContainer, airportItems);
        updateList(zoneListContainer, zoneItems);
        updateList(hotelListContainer, hotelItems);

        airportBlock.style.display = airportItems.length > 0 ? 'flex' : 'none';
        zoneBlock.style.display = zoneItems.length > 0 ? 'flex' : 'none';
        airportzoneBlock.style.display = (airportItems.length > 0 || zoneItems.length > 0) ? 'flex' : 'none';
        hotelBlock.style.width = (airportItems.length > 0 || zoneItems.length > 0) ? '50%' : '100%';
        hotelBlock.style.display = hotelItems.length > 0 ? 'flex' : 'none';

        noResults.style.display = (airportItems.length === 0 && zoneItems.length === 0 && hotelItems.length === 0) ? 'flex' : 'none';
    };

    // Función para generar listas dinámicamente a partir del JSON
    async function generateLists() {
        try {
            // Obtenemos los atributos del input de origen
            const origin_id = originInput.getAttribute("data-zone_id");
            const origin_class = originInput.getAttribute("data-class");
            const origin_dataid = originInput.getAttribute("data-id");

            console.log(origin_id);

            // Verificamos si alguno de los atributos está ausente
            if (!origin_id || !origin_class || !origin_dataid) {
                // Mostramos el mensaje de error (cambiamos display a flex)
                noOrigin.style.display = 'flex';
                hotelBlock.style.display = 'none';
                airportzoneBlock.style.display = 'none';
                // Bloqueamos la escritura en el input
                desktopInput.readOnly = true;
                mobileInput.readOnly = true;
                return; // Salimos de la función sin intentar hacer la petición
            } else {
                // Si los atributos están presentes, aseguramos que el mensaje de error esté oculto
                noOrigin.style.display = 'none';
                // Bloqueamos la escritura en el input
                getActiveInput().readOnly = false;
            }

            // const response = await fetch(`assets/php/to_data.php?origin_id=${origin_id}&data_class=${origin_class}&data_id=${origin_dataid}`);
            const response = await fetch(`http://ec2-3-14-253-99.us-east-2.compute.amazonaws.com/to_data.php?origin_id=${origin_id}&data_class=${origin_class}&data_id=${origin_dataid}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            originalData = await response.json(); // Guardamos los datos originales
            updateAllLists(originalData); // Mostramos las listas completas al inicio
        } catch (error) {
            console.error('Error al cargar o procesar el JSON:', error);
        }
    }

    // Función para crear elementos de lista
    const createListItem = (item) => {
        const listItem = document.createElement('div');
        listItem.textContent = item.name;
        Object.keys(item).forEach(key => {
            listItem.setAttribute(`data-${key}`, item[key]);
        });
        listItem.addEventListener('click', () => {
            if (window.innerWidth < 1000) {
                // En móviles, actualizamos ambos inputs: el móvil y el original
                setInputAttributes(mobileInput, item);
                setInputAttributes(desktopInput, item);
            } else {
                setInputAttributes(desktopInput, item);
            }
            toggleOriginList(false);
            getActiveInput().blur(); // Quitamos el foco del input activo
            removeErrorStyleDestination();
        });
        return listItem;
    };

    // Ajuste de posición del dropdown
    const adjustDropdownPosition = () => {
        if (window.innerWidth > 1000) {
            const rect = bookingengieContainer.getBoundingClientRect();
            destiantionListContainer.style.top = `${rect.bottom + 12}px`;
            destiantionListContainer.style.left = `${rect.left}px`;
        }
    };

    window.addEventListener("resize", () => {
        adjustDropdownPosition();
    });
    window.addEventListener("load", adjustDropdownPosition);

    // Mostrar u ocultar el contenedor de listas
    function toggleOriginList(show) {
        destiantionListContainer.style.display = show ? 'flex' : 'none';
        destinationDownSVG.style.transform = show ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Función para limpiar los valores del input y sus atributos
    function resetInput(input) {
        input.value = '';
        Array.from(input.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                input.removeAttribute(attr.name);
            }
        });
    }

    // Función para remover el estilo de error (borde rojo)
    function removeErrorStyleDestination() {
        destinationFiltContainer.style.border = 'none';
    }

    // Función para aplicar el estilo de error (borde rojo)
    function applyErrorStyle() {
        destinationFiltContainer.style.border = '2px solid var(--accent-ligth)';
        destinationFiltContainer.style.borderRadius = '5px';
    }

    // Función que se ejecuta cuando se pierde el foco o se presiona Enter en el input
    function handleInputCompletion(event) {
        const query = normalizeText(getActiveInput().value);
        if (query.trim() === '') return; // Si está vacío, no hacemos nada

        // Filtramos las tres listas
        const filteredAirports = originalData.filter(
            item => item.class === 'Airport' && normalizeText(item.name).includes(query)
        );
        const filteredZones = originalData.filter(
            item => item.class === 'Zone' && normalizeText(item.name).includes(query)
        );
        const filteredHotels = originalData.filter(
            item => item.class === 'Hotel' &&
                    (normalizeText(item.name).includes(query) || normalizeText(item.zone).includes(query))
        );

        const totalFiltered = filteredAirports.length + filteredZones.length + filteredHotels.length;

        // Si sólo hay una opción en total, se autocompleta y se pierde el foco
        if (totalFiltered === 1) {
            let selectedItem;
            if (filteredAirports.length === 1) {
                selectedItem = filteredAirports[0];
            } else if (filteredZones.length === 1) {
                selectedItem = filteredZones[0];
            } else if (filteredHotels.length === 1) {
                selectedItem = filteredHotels[0];
            }
            if (selectedItem) {
                if (window.innerWidth < 1000) {
                    setInputAttributes(mobileInput, selectedItem);
                    setInputAttributes(desktopInput, selectedItem);
                } else {
                    setInputAttributes(desktopInput, selectedItem);
                }
                toggleOriginList(false);
                removeErrorStyleDestination();
                getActiveInput().blur();
                return;
            }
        }

        // Si hay más de una opción, verificamos si existe una coincidencia exacta
        if (totalFiltered > 1) {
            const exactMatch = originalData.find(item => normalizeText(item.name) === query);
            if (exactMatch) {
                if (window.innerWidth < 1000) {
                    setInputAttributes(mobileInput, exactMatch);
                    setInputAttributes(desktopInput, exactMatch);
                } else {
                    setInputAttributes(desktopInput, exactMatch);
                }
                toggleOriginList(false);
                removeErrorStyleDestination();
                getActiveInput().blur();
                return;
            } else {
                // Si no hay coincidencia exacta, se aplica el borde rojo y se mantiene el foco
                applyErrorStyle();
                return;
            }
        }

        // Si no hay ningún resultado, se cierra el recuadro, se aplica borde rojo y se pierde el foco
        if (totalFiltered === 0) {
            toggleOriginList(false);
            applyErrorStyle();
            getActiveInput().blur();
        }
    }

    // Event listener para simular clic en el contenedor de origen
    destinationContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        // Si se hace clic sobre el contenedor de listas, no hacemos nada extra
        if (destiantionListContainer.contains(event.target)) return;
        // Removemos el estilo de error al hacer clic
        getActiveInput().focus();
        resetInput(desktopInput);
        resetInput(mobileInput);
        removeErrorStyleDestination();
        generateLists().then(() => {
            adjustDropdownPosition();
            toggleOriginList(true);
            // Si es móvil, forzamos el foco en el input móvil para que el usuario pueda escribir de inmediato
            if (window.innerWidth < 1000) {
                mobileInput.focus();
            }
        });
    });

    // Cerrar el contenedor de listas si el usuario hace clic fuera de él y del input
    document.addEventListener('click', (event) => {
        const isClickInsideList = destiantionListContainer.contains(event.target);
        const isClickInsideInput = getActiveInput().contains(event.target);
        const isCloseButton = closeButton.contains(event.target);

        if (!isClickInsideList && !isClickInsideInput) {
            toggleOriginList(false); 
        }

        if (isCloseButton) {
            toggleOriginList(false);
        }
    });

    // Adjuntamos los eventos de input, tecla y blur a ambos inputs
    desktopInput.addEventListener('input', filterLists);
    mobileInput.addEventListener('input', filterLists);

    desktopInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleInputCompletion(event);
        }
    });
    mobileInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleInputCompletion(event);
        }
    });

    desktopInput.addEventListener('blur', (event) => {
        setTimeout(() => {
            handleInputCompletion(event);
        }, 200);
    });
    mobileInput.addEventListener('blur', (event) => {
        setTimeout(() => {
            handleInputCompletion(event);
        }, 200);
    });
});
