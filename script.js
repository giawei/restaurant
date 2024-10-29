let cart = {
    max:99,
    totalPrice: 0,
    cartItems: {}// 儲存購物車內的商品
}; 

const buttons = document.querySelectorAll('.add-price');
// 獲取搜尋按鈕和輸入框
const searchButton = document.querySelector('.search');
const searchInput = document.getElementById('searchInput');
const products = document.querySelectorAll('.product');
// 更新總金額顯示的函數
function updateTotalPriceDisplay() {
    document.getElementById('totalPrice').textContent = cart.totalPrice;
    
}

// 更新購物車內容的顯示
function updateCartItemsDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; // 清空目前顯示
    
    for (const [name, quantity] of Object.entries(cart.cartItems)) {
        const itemContainer = document.createElement('div');
        itemContainer.style.display = 'flex'; // 使用 flexbox
        itemContainer.style.justifyContent = 'space-between'; // 兩邊對齊
        itemContainer.style.alignItems = 'center'; // 垂直對齊
        itemContainer.style.marginBottom = '10px'; // 增加每個項目之間的距離

        // 左側區域
        const leftArea = document.createElement('div');
        leftArea.style.display = 'flex'; // 使用 flexbox
        leftArea.style.alignItems = 'center'; // 垂直對齊
        leftArea.style.width = '60%'; // 讓左側區域佔滿空間
        leftArea.style.justifyContent = 'space-between'; // 使 itemName 和 select 分開
        // 顯示商品名稱
        const itemName = document.createElement('span');
        itemName.textContent = `${name} `; // 商品名稱

        // 創建下拉選擇框
        const select = document.createElement('select');               
        for (let i = 1; i <= cart.max; i++) {
            const option = document.createElement('option');

            option.value = i; // 設定選項的值
            option.textContent = i; // 顯示的文字
            if (i === quantity) {
                option.selected = true; // 預設選中當前數量
            }
            select.appendChild(option);
        }
        // 將商品名稱和數量選單添加到左側區域
        leftArea.appendChild(itemName); // 添加商品名稱
        leftArea.appendChild(select); // 添加下拉選單
        // 右側區域
        const rightArea = document.createElement('div');
        rightArea.style.display = 'flex'; // 使用 flexbox
        rightArea.style.alignItems = 'center'; // 垂直對齊
        rightArea.style.justifyContent = 'center'; // 置中對齊
        // 刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除';
        deleteButton.style.marginLeft = '10px'; // 左邊距
        // 將刪除按鈕添加到右側區域
        rightArea.appendChild(deleteButton);
        // 將左側區域和右側區域添加到 itemContainer
        itemContainer.appendChild(leftArea); // 添加左側區域
        itemContainer.appendChild(rightArea); // 添加右側區域
        cartItemsContainer.appendChild(itemContainer); // 添加到容器

        // 如果需要更新數量變更的邏輯，加入事件監聽器
        select.addEventListener('change', function() {
            const oldQuantity = cart.cartItems[name]; // 獲取舊的數量
            const newQuantity = parseInt(this.value);
            cart.cartItems[name] = newQuantity; // 更新 cartItems 中的數量
            // 尋找對應的按鈕來獲取價格
            const button = Array.from(buttons).find(btn => btn.getAttribute('data-name') === name); // 獲取商品價格
            const price = parseInt(button.getAttribute('data-price')); // 獲取價格
            cart.totalPrice += (newQuantity - oldQuantity) * price; // 更新總金額
            console.log(button.getAttribute('data-name')+"變更數量為"+newQuantity);
            console.log(cart.cartItems);
            // 計算價格變化
            updateTotalPriceDisplay(); // 更新總金額顯示

            if (newQuantity === cart.max) {
                button.disabled = true; // 禁用按鈕
                button.textContent = '已達選購上限'; // 更新按鈕文字
                button.style.backgroundColor = 'grey'; // 變灰色
                button.style.cursor = 'not-allowed'; // 設置游標為禁止符號
            } else {
                button.disabled = false; // 恢復按鈕
                button.textContent = '加入購物車'; // 恢復原始按鈕文字
                button.style.backgroundColor = ''; // 恢復原樣
                button.style.cursor = ''; // 恢復游標
            }    
            saveCart();    
        }); 

        deleteButton.addEventListener('click', function() {
            const button = Array.from(buttons).find(btn => btn.getAttribute('data-name') === name); // 獲取商品價格
            const price = cart.cartItems[name] * parseInt(button.getAttribute('data-price')); // 計算該品項總價
            delete cart.cartItems[name]; // 從 cartItems 中刪除該品項
            cart.totalPrice -= price; // 減去該品項的價格
            updateTotalPriceDisplay(); // 更新總金額顯示
            updateCartItemsDisplay(); // 重新渲染購物車內容
            saveCart();
        });

        
        
        
    }
}

// 清空購物車的函數
function clearCart() {
    cart.totalPrice = 0; // 將總金額設置為 0
    Object.keys(cart.cartItems).forEach(key => delete cart.cartItems[key]); // 清空購物車物品
    updateTotalPriceDisplay(); // 更新顯示
    updateCartItemsDisplay(); // 更新購物車內容
    alert('購物車已清空！'); // 提示用戶
    console.log(cart.cartItems);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}    
function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        // 檢查購物車是否為空
        if (savedCart.totalPrice > 0 || Object.keys(savedCart.cartItems).length > 0) {
            const shouldRestore = confirm("您上次的購物車有未完成的商品，是否恢復？");
            if (shouldRestore) {
                cart = savedCart; // 恢復 cart 資料
                updateTotalPriceDisplay(); // 更新顯示
                updateCartItemsDisplay(cart.max); // 傳遞 max
            } else {
                localStorage.removeItem('cart');
            }
        } else {
            // 如果購物車是空的，則不需要提示
            localStorage.removeItem('cart'); // 清除空的購物車資料
        }
    }
    console.log(cart.cartItems);
}


function add_to_cart(button){
    const price = parseInt(button.getAttribute('data-price'));
    const name = button.getAttribute('data-name');
    

    // 更新購物車中的商品數量
    if (cart.cartItems[name]) {
        cart.cartItems[name]++;
    } else {
        cart.cartItems[name] = 1;
    }
    // 更新總金額
    cart.totalPrice+=price;
    updateTotalPriceDisplay();

    //判斷是否超過上限
    if (cart.cartItems[name] >= cart.max) {
        // 禁用按鈕並改變樣式
        button.disabled = true;
        button.textContent = '已達選購上限';
        button.style.backgroundColor = 'grey';
        button.style.cursor = 'not-allowed';
    }

    updateCartItemsDisplay();
    saveCart();
    console.log(cart.cartItems);
} 
        

// 當搜尋按鈕被按下時執行的函數
searchButton.addEventListener('click', () => {
    console.log(`名稱是:${searchInput.value}`);
    filterProducts()
});
// 當輸入框內按下 Enter 鍵時執行的函數
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log(`名稱是:${searchInput.value}`);
        filterProducts()
    }
});
// 篩選並顯示符合的商品
function filterProducts(){
    const inputvalue = searchInput.value.toLowerCase();
    products.forEach(product=>{
        const productname = product.querySelector('.add-price').getAttribute('data-name').toLowerCase();

        // 如果商品名稱包含輸入值，則顯示；否則隱藏
        if (productname.includes(inputvalue)) {
            console.log(productname);
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    })
}
//輸入框是空白的情況就會顯示所有物品
searchInput.addEventListener('input',()=>{
    if (searchInput.value === ""){
        products.forEach(product=>{
            product.style.display = 'block';
        })
    }
})

//加入購物車
buttons.forEach(button => {
    button.addEventListener('click', () => add_to_cart(button));
});

// 為清空購物車按鈕添加點擊事件
document.getElementById('clearCartButton').addEventListener('click', clearCart);
document.addEventListener('DOMContentLoaded', loadCart);