document.addEventListener('DOMContentLoaded', function() {
    // Инициализация баланса и корзины
    initUserInterface();
    
    // Обработчики событий для общих элементов
    setupEventListeners();
});

/**
 * Инициализация пользовательского интерфейса
 */
function initUserInterface() {
    // Проверка наличия сохраненного баланса
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
        updateBalanceDisplay(parseFloat(savedBalance));
    }
    
    // Проверка наличия сохраненной корзины
    const savedCart = localStorage.getItem('userCart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        updateCartCount(cartItems.length);
    }
    
    // Активация текущего пункта меню
    highlightCurrentPage();
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    // Обработчик для кнопки пополнения баланса
    const topUpButton = document.querySelector('.balance .btn-primary');
    if (topUpButton) {
        topUpButton.addEventListener('click', handleTopUpBalance);
    }
    
    // Обработчик для кнопки корзины
    const cartButton = document.querySelector('.cart-icon');
    if (cartButton) {
        cartButton.addEventListener('click', handleCartClick);
    }
    
    // Обработчики для кнопок добавления в корзину на главной странице
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Обработчики для кнопок просмотра скриншота и инспекта
    const screenshotButtons = document.querySelectorAll('.btn-screenshot');
    const inspectButtons = document.querySelectorAll('.btn-inspect');
    
    screenshotButtons.forEach(button => {
        button.addEventListener('click', handleScreenshotView);
    });
    
    inspectButtons.forEach(button => {
        button.addEventListener('click', handleInspectView);
    });
}

/**
 * Подсветка текущей страницы в меню
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        } else if (currentPath === '/' && linkPath === 'index.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Обработчик пополнения баланса
 */
function handleTopUpBalance() {
    const amount = prompt('Введите сумму для пополнения (₽):', '1000');
    
    if (amount !== null) {
        const numAmount = parseFloat(amount);
        
        if (!isNaN(numAmount) && numAmount > 0) {
            // Получаем текущий баланс
            const currentBalanceText = document.querySelector('.balance-amount').textContent;
            const currentBalance = parseFloat(currentBalanceText) || 0;
            
            // Обновляем баланс
            const newBalance = currentBalance + numAmount;
            updateBalanceDisplay(newBalance);
            
            // Сохраняем в localStorage
            localStorage.setItem('userBalance', newBalance.toString());
            
            // Показываем уведомление
            showNotification(`Баланс пополнен на ${numAmount.toFixed(2)} ₽`, 'success');
        } else {
            showNotification('Пожалуйста, введите корректную сумму', 'error');
        }
    }
}

/**
 * Обновление отображения баланса
 */
function updateBalanceDisplay(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        balanceElement.textContent = `${amount.toFixed(2)} ₽`;
    }
}

/**
 * Обработчик клика по корзине
 */
function handleCartClick(event) {
    event.preventDefault();
    
    // Получаем сохраненную корзину
    const savedCart = localStorage.getItem('userCart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    if (cartItems.length === 0) {
        showNotification('Ваша корзина пуста', 'info');
    } else {
        // В реальном приложении здесь был бы переход на страницу корзины
        showNotification(`В вашей корзине ${cartItems.length} товаров`, 'info');
    }
}

/**
 * Обработчик добавления товара в корзину
 */
function handleAddToCart(event) {
    const skinCard = event.target.closest('.skin-card');
    if (!skinCard) return;
    
    const skinName = skinCard.querySelector('h3').textContent;
    const skinPrice = skinCard.querySelector('.skin-price').textContent;
    
    // Получаем текущую корзину из localStorage
    const savedCart = localStorage.getItem('userCart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    // Добавляем новый товар
    const newItem = {
        id: Date.now(), // Используем временную метку как ID
        name: skinName,
        price: skinPrice,
        image: skinCard.querySelector('.skin-image img').src
    };
    
    cartItems.push(newItem);
    
    // Сохраняем обновленную корзину
    localStorage.setItem('userCart', JSON.stringify(cartItems));
    
    // Обновляем счетчик корзины
    updateCartCount(cartItems.length);
    
    // Показываем уведомление
    showNotification(`${skinName} добавлен в корзину`, 'success');
    
    // Анимация добавления в корзину
    animateAddToCart(event.target);
}

/**
 * Обновление счетчика корзины
 */
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        
        // Добавляем анимацию при изменении
        cartCountElement.classList.add('cart-count-animation');
        setTimeout(() => {
            cartCountElement.classList.remove('cart-count-animation');
        }, 300);
    }
}

/**
 * Анимация добавления в корзину
 */
function animateAddToCart(button) {
    button.classList.add('btn-added');
    setTimeout(() => {
        button.classList.remove('btn-added');
    }, 1000);
}

/**
 * Обработчик просмотра скриншота
 */
function handleScreenshotView(event) {
    const skinCard = event.target.closest('.skin-card');
    if (!skinCard) return;
    
    const skinName = skinCard.querySelector('h3').textContent;
    showNotification(`Просмотр скриншота: ${skinName}`, 'info');
    
    // В реальном приложении здесь был бы код для открытия модального окна со скриншотом
}

/**
 * Обработчик инспекта скина
 */
function handleInspectView(event) {
    const skinCard = event.target.closest('.skin-card');
    if (!skinCard) return;
    
    const skinName = skinCard.querySelector('h3').textContent;
    showNotification(`Инспект скина: ${skinName}`, 'info');
    
    // В реальном приложении здесь был бы код для открытия 3D-модели скина
}

/**
 * Показ уведомления
 */
function showNotification(message, type = 'info') {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    
    // Добавляем обработчик для закрытия уведомления
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 10);
}

/**
 * Получение иконки для типа уведомления
 */
function getIconForType(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

// Добавляем стили для уведомлений
function addNotificationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            background-color: var(--card-bg);
            border-left: 4px solid var(--primary-color);
            border-radius: var(--radius);
            padding: 15px;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border: 1px solid var(--border-color);
            color: var(--text-color);
        }
        
        .notification-show {
            transform: translateX(0);
        }
        
        .notification-hiding {
            transform: translateX(120%);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 5px;
        }
        
        .notification-close:hover {
            color: var(--text-color);
        }
        
        .notification-success {
            border-left-color: var(--success-color);
        }
        
        .notification-success .notification-icon {
            color: var(--success-color);
        }
        
        .notification-error {
            border-left-color: var(--danger-color);
        }
        
        .notification-error .notification-icon {
            color: var(--danger-color);
        }
        
        .notification-warning {
            border-left-color: var(--warning-color);
        }
        
        .notification-warning .notification-icon {
            color: var(--warning-color);
        }
        
        .notification-info {
            border-left-color: var(--primary-color);
        }
        
        .notification-info .notification-icon {
            color: var(--primary-color);
        }
        
        .cart-count-animation {
            animation: pulse 0.3s ease;
        }
        
        .btn-added {
            animation: btnPulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        
        @keyframes btnPulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Добавляем стили для уведомлений при загрузке страницы
addNotificationStyles();