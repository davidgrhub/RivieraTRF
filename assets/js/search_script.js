document.addEventListener('DOMContentLoaded', () => {
    document.write('<style>#home-top { display: none; }</style>');
    // Variables de elementos HTML
    const onewayButton = document.getElementById('oneway__button');
    const fromInput = document.getElementById('from__input');
    const toInput = document.getElementById('to__input');
    const departureInput = document.getElementById('departure__input');
    const returnInput = document.getElementById('return__input');
    const travelersInput = document.getElementById('travelers__input');
    const search = document.getElementById('search-configuration__container');
    const fromFiltContainer = document.getElementById('from-filter__input-container');
    const toFiltContainer = document.getElementById('to-filter__input-container');
  
    search.addEventListener('click', () => {
      // 1. Verificar que fromInput tenga data-id y data-class
      const fromId = fromInput.getAttribute('data-id');
      const fromClass = fromInput.getAttribute('data-class');
      if (!fromId || !fromClass) {
        fromFiltContainer.style.border = '2px solid var(--accent-ligth)';
        fromFiltContainer.style.borderRadius = '5px';
        console.error('Falta atributo data-id o data-class en fromInput');
        return; // Se detiene la ejecución si faltan datos
      }
  
      // 2. Verificar que toInput tenga data-id y data-class
      const toId = toInput.getAttribute('data-id');
      const toClass = toInput.getAttribute('data-class');
      if (!toId || !toClass) {
        toFiltContainer.style.border = '2px solid var(--accent-ligth)';
        toFiltContainer.style.borderRadius = '5px';
        console.error('Falta atributo data-id o data-class en toInput');
        return;
      }
  
      // 3. Guardar el valor de departureInput
      const departureValue = departureInput.getAttribute('data-value');
  
      // 4. Comprobar el atributo data-active de onewayButton y, si es "false", guardar el valor de returnInput
      const oneWayActive = onewayButton.getAttribute('data-active'); // "true" o "false" (en formato string)
      let returnValue = '';
      if (oneWayActive === 'false') {
        returnValue = returnInput.getAttribute('data-value');
      }
  
      // 5. Guardar el valor de travelersInput
      const travelersValue = travelersInput.getAttribute('data-value');
  
      // Crear las variables variable_from y variable_to según el atributo data-class
      const variable_from = (fromClass === 'Hotel') ? 'Hotel' : 'ID';
      const variable_to = (toClass === 'Hotel') ? 'Hotel' : 'ID';
  
      // Calcular el valor para roundtrip (es lo contrario de oneWayActive)
      const roundtrip = (oneWayActive === 'true') ? 'false' : 'true';
  
      // 6. Construir el enlace con la estructura requerida
      let deepLink = `hhttps://www.transfersrivieramaya.us/transfers/results.aspx?origin${variable_from}=${fromId}` +
                     `&destination${variable_to}=${toId}` +
                     `&startDate=${departureValue}`;
      if (oneWayActive === 'false') {
        deepLink += `&endDate=${returnValue}`;
      }
      deepLink += `&roundtrip=${roundtrip}` +
                  `&paxs=${travelersValue}0` +
                  `&accion=searchtransfers` +
                  `&appendHashParams=categoryType%3D-1`;
  
      // Abrir el enlace en una nueva pestaña
      window.open(deepLink, '_blank');
    });
  });
  
