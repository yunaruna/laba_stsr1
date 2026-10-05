document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('furnitureForm');
    const modal = document.getElementById('resultModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const returnBtn = document.getElementById('returnBtn');
    const currentDataContainer = document.getElementById('currentDataContainer');
    const historyContainer = document.getElementById('historyContainer');

    const usernameInput = document.getElementById('username');
    const visitDateInput = document.getElementById('visitDate');

    let recordsHistory = [];

    // Динамическая валидация при вводе данных (живой отклик)
    usernameInput.addEventListener('input', () => validateUsername());
    visitDateInput.addEventListener('change', () => validateVisitDate());
    
    document.querySelectorAll('input[name="furnitureType"]').forEach(radio => {
        radio.addEventListener('change', () => validateFurnitureType());
    });

    // Валидация полей
    function validateUsername() {
        const group = document.getElementById('group-username');
        const val = usernameInput.value.trim();
        
        if (!val) {
            setInvalid(group, 'err-username', 'Пожалуйста, введите ваше имя.');
            return false;
        } else if (val.length < 2) {
            setInvalid(group, 'err-username', 'Имя должно быть не короче 2 символов.');
            return false;
        } else {
            setValid(group, 'err-username');
            return true;
        }
    }

    function validateVisitDate() {
        const group = document.getElementById('group-visitDate');
        if (!visitDateInput.value) {
            setInvalid(group, 'err-visitDate', 'Укажите дату визита.');
            return false;
        } else {
            setValid(group, 'err-visitDate');
            return true;
        }
    }

    function validateFurnitureType() {
        const group = document.getElementById('group-furnitureType');
        const checked = document.querySelector('input[name="furnitureType"]:checked');
        if (!checked) {
            setInvalid(group, 'err-furnitureType', 'Выберите тип мебели.');
            return false;
        } else {
            setValid(group, 'err-furnitureType');
            return true;
        }
    }

    function setValid(groupEl, errId) {
        groupEl.classList.remove('invalid');
        groupEl.classList.add('valid');
        document.getElementById(errId).textContent = '';
    }

    function setInvalid(groupEl, errId, message) {
        groupEl.classList.remove('valid');
        // Перезапуск анимации потряхивания при повторной ошибке
        groupEl.classList.remove('invalid');
        void groupEl.offsetWidth; 
        groupEl.classList.add('invalid');
        document.getElementById(errId).textContent = message;
    }

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUserValid = validateUsername();
        const isDateValid = validateVisitDate();
        const isTypeValid = validateFurnitureType();

        if (isUserValid && isDateValid && isTypeValid) {
            try {
                const formData = getFormData();
                recordsHistory.push(formData);

                renderResults(formData);
                modal.style.display = 'flex';
            } catch (error) {
                alert('Произошла ошибка при обработке данных: ' + error.message);
            }
        }
    });

    // Сброс всех статусов подсветки при очистке формы
    form.addEventListener('reset', () => {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('valid', 'invalid');
        });
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    });

    function getFormData() {
        return {
            username: usernameInput.value.trim(),
            visitDate: visitDateInput.value,
            favoriteColor: document.getElementById('favoriteColor').value,
            furnitureType: document.querySelector('input[name="furnitureType"]:checked').value,
            material: document.getElementById('material').value,
            priorities: Array.from(document.querySelectorAll('input[name="priorities"]:checked'))
                             .map(cb => cb.value).join(', ') || 'Не указано'
        };
    }

    function renderResults(data) {
        currentDataContainer.innerHTML = `
            <table class="result-table">
                <tr><th>Параметр</th><th>Введенные данные</th></tr>
                <tr><td>ФИО Клиента</td><td>${escapeHtml(data.username)}</td></tr>
                <tr><td>Дата посещения</td><td>${data.visitDate}</td></tr>
                <tr><td>Цвет</td><td><span class="color-box" style="background-color: ${data.favoriteColor}"></span> ${data.favoriteColor}</td></tr>
                <tr><td>Тип мебели</td><td>${data.furnitureType}</td></tr>
                <tr><td>Материал</td><td>${data.material}</td></tr>
                <tr><td>Приоритеты</td><td>${escapeHtml(data.priorities)}</td></tr>
            </table>
        `;

        let historyHTML = '<ol class="nested-list">';
        recordsHistory.forEach((record) => {
            historyHTML += `
                <li>
                    <strong>${escapeHtml(record.username)}</strong> (Дата: ${record.visitDate})
                    <ol>
                        <li>Категория: ${record.furnitureType}</li>
                        <li>Материал: ${record.material}</li>
                    </ol>
                </li>
            `;
        });
        historyHTML += '</ol>';

        historyContainer.innerHTML = historyHTML;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', closeModal);
    returnBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});