import {Ads} from "./lib.js";

const ads = new Ads();

class App {
    constructor(rootEl, ads, addBtn) {
        this.rootEl = rootEl;
        this.ads = ads;
        this.init();
        this.addBtn = addBtn;
        this.addBtn.addEventListener('click', () => {
            this.addNewAd()
        });

    }

    init() {
        // todo: parse current url

        this.viewLastAds()


    }

    viewLastAds(){
        this.rootEl.innerHTML = `    <div class="mt-3">
                    <b><h4>Новые объявления:</h4> </b></div>
                <div class="card-deck" id=""> </div>`;
        const cardDeck = document.querySelector('.card-deck');

        this.ads.getItems(items => {
            items.reverse().map(o => {
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
                        this.viewItem(o);
                    })


                }
            )
        });
    }

    viewItem(o) {
        // history.pushState(null, 'детали', '/details.html');
        // console.log(
        //     formateDate(o.date)
        // );
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
            showPhone.addEventListener('click',()=>{
                showPhone.innerHTML = `<b>${seller.phoneNumber}</b>`;
                showPhone.className = 'btn btn-outline-secondary';
            })
        });

    }

    addNewAd() {
        console.log('button works!');
        this.rootEl.innerHTML = `
        <form class='form'>
        <select name="brand" id="brand">
            <option value="Lada">Lada</option>
            <option value="Renault">Renault</option>
            <option value="Mazda">Mazda</option>
        </select>
        <select name="model" id="model">
        
        </select>
        <input type="text">
        </form>
        `;
    }
}

const app = new App(document.getElementById('root'), ads, document.getElementById('addBtn'));

function formateDate(i) {
    const date = new Date(i);
    return `размещено ${date.getDate()}.${date.getMonth()}.${date.getFullYear()} в ${date.getHours()}:${date.getMinutes()}.`
}