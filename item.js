document.addEventListener('DOMContentLoaded', function() {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    
    if (itemId) {
        // Загружаем данные о товаре
        loadItemData(itemId);
    } else {
        // Если ID не указан, показываем сообщение об ошибке
        showNotification('Товар не найден', 'error');
    }
    
    // Инициализация функций
    initTabs();
    initAddToCart();
    initBuyNow();
    initInspectButtons();
});

/**
 * Загрузка данных о товаре
 * @param {string} itemId - ID товара
 */
function loadItemData(itemId) {
    // В реальном проекте здесь был бы AJAX запрос к серверу
    // Для демонстрации используем моковые данные
    
    // Получаем данные о товаре
    const itemData = getItemData(itemId);
    
    if (!itemData) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    // Обновляем заголовок страницы
    document.title = `${itemData.name} - SkinMarket`;
    
    // Обновляем хлебные крошки
    document.getElementById('category-link').textContent = itemData.category;
    document.getElementById('category-link').href = `market.html?category=${itemData.categorySlug}`;
    document.getElementById('item-name').textContent = itemData.name;
    
    // Обновляем основное изображение
    document.getElementById('main-image').src = itemData.image;
    document.getElementById('main-image').alt = itemData.name;
    
    // Обновляем float и скидку
    document.getElementById('item-float').textContent = `Float: ${itemData.float}`;
    document.getElementById('item-discount').textContent = `-${itemData.discount}%`;
    
    // Обновляем миниатюры
    const thumbnailsContainer = document.getElementById('item-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    itemData.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${itemData.name} - Изображение ${index + 1}`;
        
        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Обновляем информацию о товаре
    document.getElementById('item-title').textContent = itemData.name;
    document.getElementById('item-category').textContent = itemData.category;
    
    // Обновляем редкость
    const rarityElement = document.getElementById('item-rarity');
    rarityElement.textContent = itemData.rarity;
    rarityElement.className = `item-rarity ${itemData.rarityClass}`;
    
    document.getElementById('item-collection').textContent = `Коллекция «${itemData.collection}»`;
    
    // Обновляем свойства
    document.getElementById('item-exterior').textContent = itemData.exterior;
    document.getElementById('item-float-value').textContent = itemData.float;
    document.getElementById('item-pattern').textContent = `#${itemData.pattern}`;
    document.getElementById('item-trade-lock').textContent = itemData.tradeLock ? `${itemData.tradeLock} дней` : 'Нет';
    
    // Обновляем наклейки
    const stickersContainer = document.getElementById('stickers-list');
    stickersContainer.innerHTML = '';
    
    if (itemData.stickers && itemData.stickers.length > 0) {
        itemData.stickers.forEach(sticker => {
            const stickerElement = document.createElement('div');
            stickerElement.className = 'sticker';
            
            const img = document.createElement('img');
            img.src = sticker.image;
            img.alt = sticker.name;
            
            const span = document.createElement('span');
            span.textContent = `Наклейка: ${sticker.name}`;
            
            stickerElement.appendChild(img);
            stickerElement.appendChild(span);
            stickersContainer.appendChild(stickerElement);
        });
    } else {
        // Если наклеек нет, скрываем блок
        document.getElementById('stickers-container').style.display = 'none';
    }
    
    // Обновляем цены
    document.getElementById('steam-price').textContent = `₽ ${formatPrice(itemData.steamPrice)}`;
    document.getElementById('our-price').textContent = `₽ ${formatPrice(itemData.ourPrice)}`;
    document.getElementById('price-discount').textContent = `-${itemData.discount}%`;
    
    // Обновляем описание
    document.getElementById('item-description').innerHTML = itemData.description;
    
    // Обновляем float информацию
    const floatValue = parseFloat(itemData.float);
    const floatPercent = floatValue * 100;
    document.getElementById('float-pointer').style.left = `${floatPercent}%`;
    document.getElementById('float-value-detail').textContent = itemData.float;
    document.getElementById('float-category').textContent = itemData.exterior;
    document.getElementById('float-category-range').textContent = itemData.exterior;
    document.getElementById('float-range').textContent = itemData.floatRange;
    
    // Загружаем похожие товары
    loadSimilarItems(itemData.similarItems);
    
    // Инициализируем миниатюры после их добавления
    initThumbnails();
}

/**
 * Загрузка похожих товаров
 * @param {Array} similarItems - Массив похожих товаров
 */
function loadSimilarItems(similarItems) {
    const container = document.getElementById('similar-items');
    container.innerHTML = '';
    
    similarItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'skin-card';
        
        card.innerHTML = `
            <div class="skin-image">
                <a href="item.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="skin-float">Float: ${item.float}</div>
                <div class="skin-discount">-${item.discount}%</div>
                <div class="skin-actions">
                    <button><i class="fas fa-image"></i></button>
                    <button><i class="fas fa-cube"></i></button>
                </div>
            </div>
            <div class="skin-info">
                <h3><a href="item.html?id=${item.id}">${item.name}</a></h3>
                <div class="skin-exterior">${item.exterior}</div>
                <div class="skin-meta">
                    <div class="skin-prices">
                        <span class="skin-price-steam">₽ ${formatPrice(item.steamPrice)}</span>
                        <span class="skin-price">₽ ${formatPrice(item.ourPrice)}</span>
                    </div>
                    <button class="btn btn-primary btn-add-cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Добавляем обработчики для кнопок добавления в корзину
    const addToCartButtons = container.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = similarItems[index];
            
            // Добавляем товар в корзину
            addItemToCart({
                name: item.name,
                price: `₽ ${formatPrice(item.ourPrice)}`,
                image: item.image,
                quantity: 1
            });
            
            // Обновляем счетчик корзины
            updateCartCount();
            
            // Показываем уведомление
            showNotification('Товар добавлен в корзину', 'success');
        });
    });
}

/**
 * Форматирование цены
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Получение данных о товаре
 * @param {string} itemId - ID товара
 * @returns {Object|null} - Данные о товаре или null, если товар не найден
 */
function getItemData(itemId) {
    // Моковые данные о товарах
    const items = {
        'dragon-lore': {
            id: 'dragon-lore',
            name: 'AWP | Dragon Lore (Minimal Wear)',
            category: 'Снайперская винтовка',
            categorySlug: 'awp',
            image: 'фото/awp-dragon-lore.png',
            images: [
                'фото/awp-dragon-lore.png',
                'фото/awp-dragon-lore-inspect.png',
                'фото/awp-dragon-lore-back.png'
            ],
            float: '0.0723',
            floatRange: '0.07 - 0.15',
            pattern: '661',
            exterior: 'Minimal Wear',
            rarity: 'Тайное',
            rarityClass: 'covert',
            collection: 'Кобальт',
            tradeLock: null,
            discount: 12,
            steamPrice: 1250000,
            ourPrice: 1100000,
            stickers: [
                {
                    name: 'Titan (Holo) | Katowice 2014',
                    image: 'фото/sticker1.png'
                },
                {
                    name: 'iBUYPOWER | Katowice 2014',
                    image: 'фото/sticker2.png'
                }
            ],
            description: `
                <p>AWP | Dragon Lore — это эксклюзивный скин для снайперской винтовки AWP в игре Counter-Strike 2. Этот скин является одним из самых редких и дорогих в игре.</p>
                <p>Скин украшен изображением дракона в золотых и желтых тонах на зеленом фоне. Дизайн скина выполнен в азиатском стиле и отличается высокой детализацией.</p>
                <p>AWP | Dragon Lore доступен в пяти состояниях износа: Factory New, Minimal Wear, Field-Tested, Well-Worn и Battle-Scarred. Данный экземпляр имеет состояние Minimal Wear, что означает минимальные следы износа и отличное качество текстур.</p>
            `,
            similarItems: [
                {
                    id: 'asiimov',
                    name: 'AWP | Asiimov',
                    image: 'фото/awp-asiimov.png',
                    float: '0.2134',
                    exterior: 'Field-Tested',
                    discount: 15,
                    steamPrice: 12500,
                    ourPrice: 10625
                },
                {
                    id: 'wildfire',
                    name: 'AWP | Wildfire',
                    image: 'фото/awp-wildfire.png',
                    float: '0.0134',
                    exterior: 'Factory New',
                    discount: 10,
                    steamPrice: 18200,
                    ourPrice: 16380
                },
                {
                    id: 'neo-noir',
                    name: 'AWP | Neo-Noir',
                    image: 'фото/awp-neo-noir.png',
                    float: '0.0723',
                    exterior: 'Minimal Wear',
                    discount: 8,
                    steamPrice: 8500,
                    ourPrice: 7820
                },
                {
                    id: 'containment-breach',
                    name: 'AWP | Containment Breach',
                    image: 'фото/awp-containment-breach.png',
                    float: '0.1523',
                    exterior: 'Field-Tested',
                    discount: 12,
                    steamPrice: 7200,
                    ourPrice: 6336
                }
            ]
        },
        'asiimov': {
            id: 'asiimov',
            name: 'AWP | Asiimov (Field-Tested)',
            category: 'Снайперская винтовка',
            categorySlug: 'awp',
            image: 'фото/awp-asiimov.png',
            images: [
                'фото/awp-asiimov.png',
                'фото/awp-asiimov-inspect.png',
                'фото/awp-asiimov-back.png'
            ],
            float: '0.2134',
            floatRange: '0.15 - 0.38',
            pattern: '123',
            exterior: 'Field-Tested',
            rarity: 'Засекреченное',
            rarityClass: 'classified',
            collection: 'Феникс',
            tradeLock: null,
            discount: 15,
            steamPrice: 12500,
            ourPrice: 10625,
            stickers: [],
            description: `
                <p>AWP | Asiimov — это популярный скин для снайперской винтовки AWP в игре Counter-Strike 2. Этот скин отличается футуристическим дизайном в бело-оранжево-черной цветовой гамме.</p>
                <p>Скин был создан художником Coridium и добавлен в игру в рамках коллекции "Операция Феникс" в феврале 2014 года.</p>
                <p>AWP | Asiimov доступен только в трех состояниях износа: Field-Tested, Well-Worn и Battle-Scarred. Данный экземпляр имеет состояние Field-Tested, что означает умеренные следы износа.</p>
            `,
            similarItems: [
                {
                    id: 'dragon-lore',
                    name: 'AWP | Dragon Lore',
                    image: 'фото/awp-dragon-lore.png',
                    float: '0.0723',
                    exterior: 'Minimal Wear',
                    discount: 12,
                    steamPrice: 1250000,
                    ourPrice: 1100000
                },
                {
                    id: 'wildfire',
                    name: 'AWP | Wildfire',
                    image: 'фото/awp-wildfire.png',
                    float: '0.0134',
                    exterior: 'Factory New',
                    discount: 10,
                    steamPrice: 18200,
                    ourPrice: 16380
                },
                {
                    id: 'neo-noir',
                    name: 'AWP | Neo-Noir',
                    image: 'фото/awp-neo-noir.png',
                    float: '0.0723',
                    exterior: 'Minimal Wear',
                    discount: 8,
                    steamPrice: 8500,
                    ourPrice: 7820
                },
                {
                    id: 'containment-breach',
                    name: 'AWP | Containment Breach',
                    image: 'фото/awp-containment-breach.png',
                    float: '0.1523',
                    exterior: 'Field-Tested',
                    discount: 12,
                    steamPrice: 7200,
                    ourPrice: 6336
                }
            ]
        },
        'fade': {
            id: 'fade',
            name: 'Karambit | Fade (Factory New)',
            category: 'Нож',
            categorySlug: 'knife',
            image: 'фото/karambit-fade.png',
            images: [
                'фото/karambit-fade.png',
                'фото/karambit-fade-inspect.png',
                'фото/karambit-fade-back.png'
            ],
            float: '0.0078',
            floatRange: '0.00 - 0.07',
            pattern: '412',
            exterior: 'Factory New',
            rarity: 'Тайное',
            rarityClass: 'covert',
            collection: 'Оружейное дело CS:GO',
            tradeLock: null,
            discount: 12,
            steamPrice: 99999,
            ourPrice: 87999,
            stickers: [],
            description: `
                <p>Karambit | Fade — это один из самых популярных и дорогих ножей в игре Counter-Strike 2. Этот нож отличается уникальным градиентом цветов от желтого до фиолетового.</p>
                <p>Процент и распределение цветов (фейда) может варьироваться, что влияет на стоимость ножа. Наиболее ценными считаются экземпляры с высоким процентом фиолетового цвета.</p>
                <p>Данный экземпляр имеет состояние Factory New, что означает минимальные следы износа и отличное качество текстур.</p>
            `,
            similarItems: [
                {
                    id: 'crimson-web',
                    name: 'Karambit | Crimson Web',
                    image: 'фото/karambit-crimson-web.png',
                    float: '0.1523',
                    exterior: 'Minimal Wear',
                    discount: 10,
                    steamPrice: 89999,
                    ourPrice: 80999
                },
                {
                    id: 'doppler',
                    name: 'Karambit | Doppler',
                    image: 'фото/karambit-doppler.png',
                    float: '0.0134',
                    exterior: 'Factory New',
                    discount: 8,
                    steamPrice: 79999,
                    ourPrice: 73599
                },
                {
                    id: 'marble-fade',
                    name: 'Karambit | Marble Fade',
                    image: 'фото/karambit-marble-fade.png',
                    float: '0.0223',
                    exterior: 'Factory New',
                    discount: 15,
                    steamPrice: 94999,
                    ourPrice: 80749
                },
                {
                    id: 'tiger-tooth',
                    name: 'Karambit | Tiger Tooth',
                    image: 'фото/karambit-tiger-tooth.png',
                    float: '0.0123',
                    exterior: 'Factory New',
                    discount: 12,
                    steamPrice: 84999,
                    ourPrice: 74799
                }
            ]
        }
    };
    
    return items[itemId] || null;
}

/**
 * Инициализация переключения миниатюр
 */
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.item-main-image img');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Удаляем активный класс у всех миниатюр
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс к выбранной миниатюре
            this.classList.add('active');
            
            // Обновляем основное изображение
            const imgSrc = this.querySelector('img').getAttribute('src');
            mainImage.setAttribute('src', imgSrc);
        });
    });
}

/**
 * Инициализация вкладок с описанием
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Показываем соответствующий контент
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Инициализация кнопки "Добавить в корзину"
 */
function initAddToCart() {
    const addToCartBtn = document.querySelector('.btn-add-cart');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Получаем данные о товаре
            const itemName = document.querySelector('.item-title').textContent;
            const itemPrice = document.querySelector('.our-price .price-value').textContent;
            const itemImage = document.querySelector('.item-main-image img').getAttribute('src');
            
            // Добавляем товар в корзину (в localStorage)
            addItemToCart({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
            
            // Обновляем счетчик корзины
            updateCartCount();
            
            // Показываем уведомление
            showNotification('Товар добавлен в корзину', 'success');
        });
    }
}

/**
 * Инициализация кнопки "Купить сейчас"
 */
function initBuyNow() {
    const buyNowBtn = document.querySelector('.btn-buy-now');
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            // Получаем данные о товаре
            const itemName = document.querySelector('.item-title').textContent;
            const itemPrice = document.querySelector('.our-price .price-value').textContent;
            const itemImage = document.querySelector('.item-main-image img').getAttribute('src');
            
            // Добавляем товар в корзину (в localStorage)
            addItemToCart({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
            
            // Обновляем счетчик корзины
            updateCartCount();
            
            // Перенаправляем на страницу оформления заказа
            // window.location.href = 'checkout.html';
            
            // Пока нет страницы оформления заказа, просто показываем уведомление
            showNotification('Перенаправление на страницу оформления заказа...', 'info');
        });
    }
}

/**
 * Инициализация кнопок инспекта и скриншотов
 */
function initInspectButtons() {
    const inspectBtn = document.querySelector('.btn-inspect');
    const screenshotBtn = document.querySelector('.btn-screenshot');
    
    if (inspectBtn) {
        inspectBtn.addEventListener('click', function() {
            showNotification('3D инспект временно недоступен', 'info');
        });
    }
    
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', function() {
            showNotification('Скриншоты временно недоступны', 'info');
        });
    }
}

/**
 * Добавление товара в корзину
 * @param {Object} item - Объект с данными о товаре
 */
function addItemToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Если товара нет, добавляем новый
        cart.push(item);
    }
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Обновление счетчика товаров в корзине
 */
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Считаем общее количество товаров
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Обновляем счетчик
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

/**
 * Показ уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Проверяем, существует ли контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    // Если контейнера нет, создаем его
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Добавляем иконку в зависимости от типа
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    // Формируем содержимое уведомления
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    
    // Добавляем обработчик для закрытия уведомления
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('notification-hide');
        
        // Удаляем уведомление после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.add('notification-hide');
        
        // Удаляем уведомление после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 