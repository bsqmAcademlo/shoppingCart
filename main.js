import { dataDB } from "./js/data.js";

const contentFoods = document.querySelector(".content_foods");

const cartShopping = document.querySelector(".cartShopping");
const containerShopping = document.querySelector(".container__shopping");
const contentShopping = document.querySelector(".content_shopping");
const shoppingTotal = document.querySelector(".shoppingTotal");
const btnBuy = document.querySelector("#btnBuy");
const infoQuatityProducts = document.querySelector(".infoQuatityProducts");

let data = dataDB;
let shoppingObj = {};

contentShopping.addEventListener("click", (event) => {
    if (event.target.classList.contains("rest")) {
        const id = parseInt(event.target.parentElement.id);

        if (shoppingObj[id].amount === 1) {
            const res = confirm("seguro quieres eliminar esto?");

            if (res) {
                delete shoppingObj[id];
            }
        } else {
            shoppingObj[id].amount--;
        }
    }

    if (event.target.classList.contains("add")) {
        const id = parseInt(event.target.parentElement.id);

        if (shoppingObj[id].stock > shoppingObj[id].amount) {
            shoppingObj[id].amount++;
        } else {
            alert("No tenemos disnibilidad");
        }
    }

    if (event.target.classList.contains("del")) {
        const id = parseInt(event.target.parentElement.id);

        const res = confirm("seguro quieres eliminar esto?");

        if (res) {
            delete shoppingObj[id];
        }
    }

    amountProductInCart();
    printTotalPrice();
    printShoppingCart();
});

contentFoods.addEventListener("click", (event) => {
    if (event.target.classList.contains("add_principal")) {
        const id = parseInt(event.target.parentElement.id);

        const [currentProduct] = data.filter((n) => n.id === id);

        if (shoppingObj[id]) {
            if (shoppingObj[id].stock > shoppingObj[id].amount) {
                shoppingObj[id].amount++;
            } else {
                alert("No tenemos disnibilidad");
            }
        } else {
            if (!currentProduct.stock) return alert("No hay en el inventario");
            shoppingObj[id] = currentProduct;
            shoppingObj[id].amount = 1;
        }

        amountProductInCart();
        printTotalPrice();
        printShoppingCart();
    }
});

function amountProductInCart() {
    infoQuatityProducts.textContent = Object.values(shoppingObj).length;
}

function printTotalPrice() {
    const shoppingArray = Object.values(shoppingObj);

    let suma = 0;

    shoppingArray.forEach((n) => {
        suma += n.amount * n.price;
    });

    shoppingTotal.textContent = suma;
}

function printShoppingCart() {
    const shoppingArray = Object.values(shoppingObj);

    let html = "";

    shoppingArray.forEach(({ id, name, price, stock, urlImages, amount }) => {
        html += `
            <div class="shopping">
                <div class="shopping__header">
                    <div class="shopping__img">
                        <img src="${urlImages}" alt="${name}">
                    </div>
                    <div class="shopping__info">
                        <p>nombre: ${name}</p>
                        <p>precio: ${price}</p>
                        <p>stock: ${stock}</p>
                    </div>
                </div>

                <div class="shopping__actions" id="${id}">
                    <span class="rest">-</span>
                    <b class="amount">${amount}</b>
                    <span class="add">+</span>
                    <i class='bx bxs-trash del'></i>
                </div>
            </div>`;
    });

    contentShopping.innerHTML = html;
}

function printFood(array) {
    let html = "";

    array.forEach(({ id, name, price, stock, urlImages }) => {
        html += `
        <div class="food">
            <div class="food__img">
                <img src="${urlImages}" alt="">
            </div>
            <div class="food__info">
                <p class="food__info-name">nombre: ${name}</p>
                <p class="food__info-stock">stock: ${stock}</p>
                <p class="food__info-price">precio: ${price}</p>
            </div>
            <div class="food__action" id="${id}">
                <button class="add_principal">Agregar</button>
            </div>
        </div>`;
    });

    contentFoods.innerHTML = html;
}

printFood(data);

cartShopping.addEventListener("click", () => {
    containerShopping.classList.toggle("show__shopping");
});

btnBuy.addEventListener("click", () => {
    const res = confirm("Desea encargar esta comida?");

    if (res) {
        const shopping = Object.entries(shoppingObj);

        data = data.map((eData) => {
            const productInShopping = shopping.find(
                (product) => parseInt(product[0]) === eData.id
            );

            if (!productInShopping) return eData;

            return {
                ...eData,
                stock: eData.stock - productInShopping[1].amount,
            };
        });

        shoppingObj = {};
        shoppingTotal.textContent = 0;
        infoQuatityProducts.textContent = 0;

        printShoppingCart();
        printFood(data);
    }
});
