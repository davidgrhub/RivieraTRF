document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const returnInput = document.getElementById('return__input');
    const monthContainer = document.getElementById('month-contianer-return');
    const lastMonthButton = document.getElementById('last-month-return');
    const nextMonthButton = document.getElementById('next-month-return');
    const dateContainer = document.getElementById('date-container-return');
    const bookingengieContainer = document.getElementById('bookingengine-filter__container');
    const returnContainer = document.getElementById('return__container');
    const returnCalendarContainer = document.getElementById('return-configuration__container');
    const returnDeparture = document.getElementById('done-return__button');
    const closeButton = document.getElementById('close-return__button');
    
    // Inicializar currentDate usando el valor del input (si existe) o la fecha actual
    let currentDate;
    let initialDateStr = returnInput.getAttribute('data-value');
    if (initialDateStr) {
        currentDate = new Date(initialDateStr);
    } else {
        currentDate = new Date();
    }
    
    let options = { month: 'short', day: 'numeric', year: 'numeric' };
    returnInput.value = currentDate.toLocaleDateString('en-US', options);
    
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
    returnInput.setAttribute('data-value', formattedDate);
    
    returnInput.readOnly = true;
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const adjustDropdownPosition = () => {
        if (window.innerWidth > 1000) {
            const rect = bookingengieContainer.getBoundingClientRect();
            returnCalendarContainer.style.top = `${rect.bottom + 12}px`;
            returnCalendarContainer.style.right = `${rect.left}px`;
        }
    };

    window.addEventListener("resize", adjustDropdownPosition);
    window.addEventListener("load", adjustDropdownPosition);
    
    function toggleOriginList(show) {
        returnCalendarContainer.style.display = show ? 'flex' : 'none';
    }
    
    // Al abrir el contenedor, se carga el mes según el valor actual del input
    returnContainer.addEventListener('click', (event) => {
        if (!returnCalendarContainer.contains(event.target)) {
            adjustDropdownPosition();
            let returnDateStr = returnInput.getAttribute('data-value');
            if (returnDateStr) {
                currentDate = new Date(returnDateStr);
            }
            updateCalendar();
            toggleOriginList(true);
        }
    });
    
    document.addEventListener('click', (event) => {
        if (!returnContainer.contains(event.target) && !returnCalendarContainer.contains(event.target)) {
            toggleOriginList(false);
        }
        if (closeButton.contains(event.target)) {
            toggleOriginList(false);
        }
    });
    
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
    
    // Al generar los días, se deshabilitan aquellos anteriores a la fecha de departure
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
            emptyBtn.type = "button";
            emptyBtn.textContent = '';
            dateContainer.appendChild(emptyBtn);
        }
        
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const today = new Date();
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Obtener la fecha de departure para comparar
        const departureInput = document.getElementById('departure__input');
        let departureDate;
        if (departureInput && departureInput.getAttribute('data-value')) {
            departureDate = new Date(departureInput.getAttribute('data-value'));
        } else {
            departureDate = todayWithoutTime;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = "date";
            dayBtn.type = "button";
            dayBtn.textContent = day;
            const cellDate = new Date(year, monthIndex, day);
            
            // Deshabilitar días anteriores a la fecha de departure
            if (cellDate < departureDate) {
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
    
    returnDeparture.addEventListener('click', () => {
        const selectedBtn = dateContainer.querySelector('.date.select-date');
        if (selectedBtn) {
            const selectedDay = parseInt(selectedBtn.textContent, 10);
            const year = currentDate.getFullYear();
            const monthIndex = currentDate.getMonth();
            const selectedDate = new Date(year, monthIndex, selectedDay);
            
            returnInput.value = selectedDate.toLocaleDateString('en-US', options);
            const formattedYear = selectedDate.getFullYear();
            const formattedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const formattedDay = String(selectedDate.getDate()).padStart(2, '0');
            returnInput.setAttribute('data-value', `${formattedYear}-${formattedMonth}-${formattedDay}`);
        }
        toggleOriginList(false);
    });
    
    updateCalendar();
});
