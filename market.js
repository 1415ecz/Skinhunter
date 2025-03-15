// Создаем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .notification {
        background-color: var(--card-bg);
        color: var(--text-color);
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
        border: 1px solid var(--border-color);
    }
    
    .notification.success {
        border-left: 4px solid #0dbaba;
    }
    
    .notification.error {
        border-left: 4px solid #ff4757;
    }
    
    .notification.warning {
        border-left: 4px solid #ffa502;
    }
    
    .notification.info {
        border-left: 4px solid #2e86de;
    }
    
    .notification.show {
        transform: translateX(0);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 4px 8px rgba(13, 186, 186, 0.05);
        }
        50% {
            box-shadow: 0 4px 8px rgba(13, 186, 186, 0.2);
        }
        100% {
            box-shadow: 0 4px 8px rgba(13, 186, 186, 0.05);
        }
    }
`;

document.addEventListener('DOMContentLoaded', function() {
    // Добавляем стили для уведомлений
    document.head.appendChild(notificationStyles);
    
    // Инициализация слайдеров цены и float
    initRangeSliders();
    
    // Обработчики для кнопок добавления в корзину
    initAddToCartButtons();
    
    // Обработчики для кнопок просмотра скриншотов и инспекта
    initSkinActions();
    
    // Фильтры и сортировка
    initFilters();
    
    // Инициализация кнопки пополнения баланса
    const topUpButton = document.querySelector('.btn-top-up');
    if (topUpButton) {
        topUpButton.addEventListener('click', function() {
            const amount = parseFloat(prompt('Введите сумму пополнения:', '1000'));
            if (!isNaN(amount) && amount > 0) {
                updateBalance(amount);
            } else if (amount <= 0) {
                showNotification('Сумма пополнения должна быть больше нуля', 'error');
            }
        });
    }
});

// Инициализация слайдеров диапазона
function initRangeSliders() {
    // Слайдер цены
    const priceSlider = document.querySelector('.price-slider');
    const priceMinInput = document.querySelector('.price-inputs input:first-child');
    const priceMaxInput = document.querySelector('.price-inputs input:last-child');
    
    if (priceSlider && priceMinInput && priceMaxInput) {
        priceSlider.addEventListener('input', function() {
            const value = this.value;
            const max = this.max;
            priceMaxInput.value = value;
            
            // Обновляем фоновый цвет слайдера
            const percentage = (value / max) * 100;
            this.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        });
        
        // Инициализация начального состояния
        const initialPercentage = (priceSlider.value / priceSlider.max) * 100;
        priceSlider.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${initialPercentage}%, #e0e0e0 ${initialPercentage}%, #e0e0e0 100%)`;
    }
    
    // Слайдер float
    const floatSlider = document.querySelector('.float-slider');
    const floatMinInput = document.querySelector('.float-inputs input:first-child');
    const floatMaxInput = document.querySelector('.float-inputs input:last-child');
    
    if (floatSlider && floatMinInput && floatMaxInput) {
        floatSlider.addEventListener('input', function() {
            const value = this.value;
            const max = this.max;
            const floatValue = (value / max).toFixed(2);
            floatMaxInput.value = floatValue;
            
            // Обновляем фоновый цвет слайдера
            const floatPercentage = (value / max) * 100;
            this.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${floatPercentage}%, #e0e0e0 ${floatPercentage}%, #e0e0e0 100%)`;
        });
        
        // Инициализация начального состояния
        const initialFloatPercentage = (floatSlider.value / floatSlider.max) * 100;
        floatSlider.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${initialFloatPercentage}%, #e0e0e0 ${initialFloatPercentage}%, #e0e0e0 100%)`;
    }
}

// Инициализация кнопок добавления в корзину
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Получаем информацию о скине
            const skinCard = this.closest('.skin-card');
            const skinName = skinCard.querySelector('.skin-info h3').textContent;
            
            // Обновляем счетчик корзины
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const currentCount = parseInt(cartCount.textContent);
                cartCount.textContent = currentCount + 1;
                
                // Анимация счетчика
                cartCount.classList.add('pulse');
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 300);
            }
            
            // Добавляем класс для анимации кнопки
            this.classList.add('added');
            
            // Показываем уведомление
            showNotification(`${skinName} добавлен в корзину`, 'success');
            
            // Возвращаем кнопку в исходное состояние через 1 секунду
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });
}

// Инициализация кнопок просмотра скриншотов и инспекта
function initSkinActions() {
    // Обработчики для кнопок скриншотов
    const screenshotButtons = document.querySelectorAll('.skin-actions button:first-child');
    
    screenshotButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const skinCard = this.closest('.skin-card');
            const skinName = skinCard.querySelector('.skin-info h3').textContent;
            
            // Здесь будет логика для показа скриншотов
            showNotification(`Просмотр скриншотов для ${skinName}`, 'info');
        });
    });
    
    // Обработчики для кнопок инспекта
    const inspectButtons = document.querySelectorAll('.skin-actions button:last-child');
    
    inspectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const skinCard = this.closest('.skin-card');
            const skinName = skinCard.querySelector('.skin-info h3').textContent;
            
            // Здесь будет логика для инспекта скина
            showNotification(`Инспект скина ${skinName}`, 'info');
        });
    });
}

// Инициализация фильтров
function initFilters() {
    // Обработчики для заголовков фильтров
    const filterHeaders = document.querySelectorAll('.filter-header');
    
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
    
    // Обработчик для кнопки сброса фильтров
    const resetButton = document.querySelector('.btn-reset-filters');
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Сбрасываем все чекбоксы
            const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Сбрасываем слайдеры
            const priceSlider = document.querySelector('.price-slider');
            const priceMinInput = document.querySelector('.price-inputs input:first-child');
            const priceMaxInput = document.querySelector('.price-inputs input:last-child');
            
            if (priceSlider) {
                priceMinInput.value = '0';
                priceMaxInput.value = priceSlider.max;
                priceSlider.value = priceSlider.max / 2;
                const initialPercentage = 50;
                priceSlider.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${initialPercentage}%, #e0e0e0 ${initialPercentage}%, #e0e0e0 100%)`;
            }
            
            const floatSlider = document.querySelector('.float-slider');
            const floatMinInput = document.querySelector('.float-inputs input:first-child');
            const floatMaxInput = document.querySelector('.float-inputs input:last-child');
            
            if (floatSlider) {
                floatMinInput.value = '0';
                floatMaxInput.value = '1';
                floatSlider.value = floatSlider.max / 2;
                const initialFloatPercentage = 50;
                floatSlider.style.background = `linear-gradient(to right, #0dbaba 0%, #0dbaba ${initialFloatPercentage}%, #e0e0e0 ${initialFloatPercentage}%, #e0e0e0 100%)`;
            }
            
            // Сбрасываем поля ввода
            const inputs = document.querySelectorAll('.market-search input');
            inputs.forEach(input => {
                input.value = '';
            });
            
            // Уведомление о сбросе фильтров
            showNotification('Все фильтры сброшены', 'warning');
        });
    }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'success') {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Добавляем иконку в зависимости от типа
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle" style="margin-right: 10px; color: #0dbaba;"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle" style="margin-right: 10px; color: #ff4757;"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle" style="margin-right: 10px; color: #ffa502;"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle" style="margin-right: 10px; color: #2e86de;"></i>';
            break;
    }
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Функция для обновления баланса (для демонстрации)
function updateBalance(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        const currentBalance = parseFloat(balanceElement.textContent);
        const newBalance = currentBalance + amount;
        balanceElement.textContent = newBalance.toFixed(2) + ' ₽';
        
        // Показываем уведомление
        showNotification(`Баланс пополнен на ${amount.toFixed(2)} ₽`, 'success');
    }
} 