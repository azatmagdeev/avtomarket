import {Ads, formateDate, loading} from "./lib.js";

const ads = new Ads();

class App {
    constructor(ads, rootEl, addBtn, searchEl) {
        this.ads = ads;
        this.rootEl = rootEl;
        this.searchEl = searchEl;
        this.addBtn = addBtn;
        this.addBtn.addEventListener('click', () => {
            this.addNewAd()
        });
        this.init();
    }


    init() {
        // todo: parse current url


        loading(this.rootEl);
        setTimeout(this.ads.getItems(items => {
            this.viewLastAds(items);

            this.searchEl.addEventListener('input', () => {
                loading(this.rootEl);
                setTimeout(() => {
                    this.searchItems(this.searchEl.value, items)
                }, 1000)
            });
        }), 1000);


    }

    viewLastAds(items) {
        history.pushState(null,'Новые объявления','');


        // console.log(history.state);
        this.rootEl.innerHTML = `    <div class="mt-3">
                    <b><h4>Новые объявления:</h4> </b></div>
                    <p>Всего объявлений: ${items.length}</p>
                <div class="card-deck" id=""> </div>`;
        const cardDeck = document.querySelector('.card-deck');

        this.viewCardDeck(items.reverse(), cardDeck);


    }

    viewItem(o) {
        history.pushState(null, `${o.brand} ${o.model}, ${o.year}`, `${o.brand}${o.model}${o.year}.html`);
        // console.log(history.state);

        this.ads.getSellers(sellers => {
            console.log('sellers', sellers);
            const seller = sellers.filter(seller => seller.id === o.sellerId)[0];
            console.log('seller', seller);
            this.rootEl.textContent = '';
            this.rootEl.innerHTML = `
            <button class="btn btn-primary mt-3" id="backBtn"><- Назад</button>
            <h3 class="">${o.brand} ${o.model}, ${o.year}</h3>
            <img class="mt-3" width="100%" src=${o.photos[0]}>
            <table class="mt-3">
             <tr><td>Марка:</td><td>${o.brand}</td></tr>
            <tr><td>Модель:</td><td>${o.model}</td></tr>
            <tr><td>Год выпуска:</td><td>${o.year}</td></tr>
            <tr><td>Пробег:</td><td>${o.km}</td></tr>
            <tr><td>Коробка:</td><td>${o.gearbox}</td></tr>
            </table>
            <h3 class="mt-3" style="color: blue">Цена: <b>${o.price} руб.</b></h3>
            <p>${o.text}</p>
            <p class="mt-3"><h5>Продавец: ${seller.name}</h5></p>
            <button class="btn btn-primary" id="showPhone">Показать телефон</button>
            <button class="btn btn-outline-secondary" id="smsSeller">Написать сообщение</button>
            <p class="mt-3">${formateDate(o.date)}</p>
            `;
            const backBtn = document.getElementById('backBtn');
            backBtn.addEventListener('click', () => {
                this.init()
            });
            const showPhone = document.getElementById('showPhone');
            showPhone.addEventListener('click', () => {
                showPhone.innerHTML = `<b>${seller.phoneNumber}</b>`;
                showPhone.className = 'btn btn-outline-secondary';
            })
        });

    }


    searchItems(string, items) {
        string = string.toLowerCase();
        console.log('search', string);
        const re = new RegExp(string);
        console.log(re);
        let filteredItems = [];
        items.map(o => {
            const obj = `${o.brand} ${o.model} ${o.year} ${o.text}`.toLowerCase();
            // console.log(typeof obj);
            const searchedItems = re.exec(obj);
            console.log(searchedItems);
            if (searchedItems !== null) {
                filteredItems.push(o)
            }
            console.log(filteredItems);
        });

        this.rootEl.innerHTML = `    <div class="mt-3">
                    <b><h4>Результаты поиска: ${filteredItems.length}</h4> </b></div>
                <div class="card-deck" id=""> </div>`;
        const cardDeck = document.querySelector('.card-deck');

        this.viewCardDeck(filteredItems, cardDeck);

    }

    viewCardDeck(items, cardDeck) {

        if (items.length === 0) {
            cardDeck.innerHTML = `Ничего не найдено ¯\\_(ツ)_/¯ `;
        } else {
            items.map(o => {
                    const cardEl = document.createElement('div');
                    cardEl.innerHTML = `
                  <div class="card mt-3 " style="width: 18rem;">
                        <img class="card-img-top" src=${o.photos[0]} alt="Card image cap" width="286 px" height="215 px">
                        <div class="card-body">

                            <a href="#" class=""><h5 class="card-title">${o.brand} ${o.model}, ${o.year}</h5></a>
                            <p class="card-text"><b>${o.price} руб.</b></p>
                            <p class="card-text">Казань</p>
<!--                            <p class="card-text">${o.date}</p>-->

                        </div>
                    </div>
                `;

                    cardDeck.appendChild(cardEl);
                    cardEl.addEventListener('click' || 'touchstart', (ev) => {
                        ev.preventDefault();
                        loading(this.rootEl);
                        setTimeout(() => {
                            this.viewItem(o)
                        }, 100)

                    })


                }
            )
        }
    }

    addNewAd() {
        console.log('button works!');

        this.rootEl.innerHTML = `<h4>Новое объявление</h4>
            
            <div class="container">
            <div class="row">
            <div class="col"><p>Выберите марку <ul id="brand"></ul></p></div>
            <div class="col" <p>Выберите модель <ul id="model"></ul></p></div>
            </div>
            </div>

            `;
        const brandEl = document.getElementById('brand');
        const modelEl = document.getElementById('model');

        brands.map(brand => {
            const li = document.createElement('li');
            brandEl.appendChild(li);
            const a = document.createElement('a');
            a.href = '#';
            li.appendChild(a);
            a.textContent = `${brand.name}`;
            a.addEventListener('click', ev => {
                ev.preventDefault();
                modelEl.innerHTML = '';
                this.selectModel(brand,modelEl)
            })
        })

    }

    selectModel(brand,modelEl) {
        console.log(brand);


        brand.models.map(model =>{
            const li = document.createElement('li');
            modelEl.appendChild(li);
            const a = document.createElement('a');
            a.href='#';
            li.appendChild(a);
            a.textContent = `${model}`;
            a.addEventListener('click',ev => {
                ev.preventDefault();

            })
        })

    }
}

const audi = {
    name: "Audi",
    models: ['A4', 'A6', 'A7', 'Q5', 'Q7']
};
const citroen = {
    name: "Citroen",
    models: ["C3", 'C4', 'C5']
};
const lada = {
    name: "Lada",
    models: ["Granta", "Kalina", "Priora", "Vesta"]
};
const subaru = {
    name: "Subaru",
    models: ['Legacy', 'Tribeca', 'Outback']
};
const toyota = {
    name: "Toyota",
    models: ['Corola', 'Camry', 'Rav4']
};
const bmw = {name:"BMW",
models:['X1','X3','X5','X6']};

const brands = [audi, bmw, citroen, lada, subaru, toyota];


const app = new App(ads,
    document.getElementById('root'),
    document.getElementById('addBtn'),
    document.getElementById('search'),
);


