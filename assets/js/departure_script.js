document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const departureInput = document.getElementById('departure__input');
    const monthContainer = document.getElementById('month-contianer-departure');
    const lastMonthButton = document.getElementById('last-month-departure');
    const nextMonthButton = document.getElementById('next-month-departure');
    const dateContainer = document.getElementById('date-container-departure');
    const bookingengieContainer = document.getElementById('bookingengine-filter__container');
    const departureContainer = document.getElementById('departure__container');
    const departureCalendarContainer = document.getElementById('departure-configuration__container');
    const doneDeparture = document.getElementById('done-departure__button');
    const closeButton = document.getElementById('close-departure__button');

    // Inicializar currentDate usando el valor del input (si existe) o la fecha actual
    let currentDate;
    let initialDateStr = departureInput.getAttribute('data-value');
    if (initialDateStr) {
        currentDate = new Date(initialDateStr);
    } else {
        currentDate = new Date();
    }
    
    // Opciones para el formato "Dec 27, 2025"
    let options = { month: 'short', day: 'numeric', year: 'numeric' };
    departureInput.value = currentDate.toLocaleDateString('en-US', options);
    
    // Actualizar atributo data-value con formato "YYYY-mm-dd"
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
    departureInput.setAttribute('data-value', formattedDate);
    
    // Bloquear la edición manual
    departureInput.readOnly = true;
    
    // Nombres de los meses
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Ajuste de posición del dropdown
    const adjustDropdownPosition = () => {
        if (window.innerWidth > 1000) {
            const rect = bookingengieContainer.getBoundingClientRect();
            departureCalendarContainer.style.top = `${rect.bottom + 12}px`;
            departureCalendarContainer.style.right = `${rect.left}px`;
        }
    };

    window.addEventListener("resize", adjustDropdownPosition);
    window.addEventListener("load", adjustDropdownPosition);
    
    // Mostrar u ocultar el contenedor del calendario
    function toggleOriginList(show) {
        departureCalendarContainer.style.display = show ? 'flex' : 'none';
    }
    
    // Al hacer click en el contenedor, se actualiza el calendario con la fecha almacenada en el input
    departureContainer.addEventListener('click', (event) => {
        if (!departureCalendarContainer.contains(event.target)) {
            adjustDropdownPosition();
            let departureDateStr = departureInput.getAttribute('data-value');
            if (departureDateStr) {
                currentDate = new Date(departureDateStr);
            }
            updateCalendar();
            toggleOriginList(true);
        }
    });
    
    // Cerrar el calendario al hacer click fuera o en el botón cerrar
    document.addEventListener('click', (event) => {
        if (!departureContainer.contains(event.target) && !departureCalendarContainer.contains(event.target)) {
            toggleOriginList(false);
        }
        if (closeButton.contains(event.target)) {
            toggleOriginList(false);
        }
    });
    
    // Actualiza el encabezado del calendario y genera los días
    function updateCalendar() {
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthText = months[monthIndex];
        const monthValue = String(monthIndex + 1).padStart(2, '0');
        
        monthContainer.textContent = `${monthText} ${year}`;
        monthContainer.setAttribute('data-month-text', monthText);
        monthContainer.setAttribute('data-month-value', monthValue);
        monthContainer.setAttribute('data-year', year);
        
        updateDays();
    }
    
    // Genera los botones de los días
    function updateDays() {
        dateContainer.innerHTML = '';
        
        const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        daysOfWeek.forEach(day => {
            const spanDay = document.createElement('span');
            spanDay.className = "day";
            spanDay.textContent = day;
            dateContainer.appendChild(spanDay);
        });
        
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const offset = (firstDayOfMonth.getDay() + 6) % 7;
        
        for (let i = 0; i < offset; i++) {
            const emptyBtn = document.createElement('button');
            emptyBtn.className = "date faded";
            emptyBtn.textContent = '';
            dateContainer.appendChild(emptyBtn);
        }
        
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const today = new Date();
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = "date";
            dayBtn.textContent = day;
            const cellDate = new Date(year, monthIndex, day);
            
            if (cellDate < todayWithoutTime) {
                dayBtn.classList.add("block-date");
            }
            
            if (
                year === today.getFullYear() &&
                monthIndex === today.getMonth() &&
                day === today.getDate()
            ) {
                dayBtn.classList.add("current-day");
            }
            
            if (!dayBtn.classList.contains("block-date")) {
                dayBtn.addEventListener("click", function() {
                    const selectedDays = dateContainer.querySelectorAll(".date.select-date");
                    selectedDays.forEach(btn => btn.classList.remove("select-date"));
                    dayBtn.classList.add("select-date");
                });
            }
            
            dateContainer.appendChild(dayBtn);
        }
        
        const totalCells = offset + daysInMonth;
        const remainder = totalCells % 7;
        if (remainder !== 0) {
            const blanksToAdd = 7 - remainder;
            for (let i = 0; i < blanksToAdd; i++) {
                const emptyBtn = document.createElement('button');
                emptyBtn.className = "date faded";
                emptyBtn.textContent = '';
                dateContainer.appendChild(emptyBtn);
            }
        }
    }
    
    lastMonthButton.addEventListener('click', () => {
        if (currentDate.getMonth() === 0) {
            currentDate = new Date(currentDate.getFullYear() - 1, 11, 1);
        } else {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        }
        updateCalendar();
    });
    
    nextMonthButton.addEventListener('click', () => {
        if (currentDate.getMonth() === 11) {
            currentDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        } else {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
        updateCalendar();
    });
    
    // Al confirmar la fecha de departure, se actualiza el input y se revisa el input de return
    doneDeparture.addEventListener('click', () => {
        const selectedBtn = dateContainer.querySelector('.date.select-date');
        if (selectedBtn) {
            const selectedDay = parseInt(selectedBtn.textContent, 10);
            const year = currentDate.getFullYear();
            const monthIndex = currentDate.getMonth();
            const selectedDate = new Date(year, monthIndex, selectedDay);
            
            departureInput.value = selectedDate.toLocaleDateString('en-US', options);
            const formattedYear = selectedDate.getFullYear();
            const formattedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const formattedDay = String(selectedDate.getDate()).padStart(2, '0');
            departureInput.setAttribute('data-value', `${formattedYear}-${formattedMonth}-${formattedDay}`);
            
            // Si la fecha de return es menor que la nueva fecha de departure, se actualiza para que coincida
            const returnInput = document.getElementById('return__input');
            if (returnInput) {
                const returnValue = returnInput.getAttribute('data-value');
                if (returnValue) {
                    const returnDate = new Date(returnValue);
                    if (selectedDate > returnDate) {
                        returnInput.value = selectedDate.toLocaleDateString('en-US', options);
                        returnInput.setAttribute('data-value', `${formattedYear}-${formattedMonth}-${formattedDay}`);
                    }
                }
            }
        }
        toggleOriginList(false);
    });
    
    updateCalendar();
});
