import {Ads} from "./lib.js";

const ads = new Ads();

class App {
    constructor(rootEl, ads) {
        this.rootEl = rootEl;
        this.ads = ads;
        this.init()
    }

    init() {

        this.ads.getItems(items => {
            items.map(o => {
                    const cardEl = document.createElement('div');
                    cardEl.innerHTML = `
                  <div class="card mt-3 " style="width: 18rem;">
                        <img class="card-img-top" src=${o.photos[0]} alt="Card image cap" width="286 px" height="215 px">
                        <div class="card-body">

                            <a href="#" class=""><h5 class="card-title">${o.brand} ${o.model}, ${o.year}</h5></a>
                            <p class="card-text"><b>${o.price} руб.</b></p>
                            <p class="card-text">Казань</p>
                            <p class="card-text">${o.date}</p>

                        </div>
                    </div>
                `;
                    this.rootEl.appendChild(cardEl);
                    cardEl.addEventListener('click', () => {
                        this.viewItem(o);
                    })

                }
            )
        });
    }

    viewItem(o) {
        console.log(o);
    }
}

const app = new App(document.getElementById('root'), ads);