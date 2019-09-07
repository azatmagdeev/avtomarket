import {Ads, Ad, formateDate, loading} from "./lib.js";
import {cars, defineOptions} from "./cars.js";

const ads = new Ads();

class App {
    constructor(ads, rootEl, addBtn, searchEl) {
        this.ads = ads;
        this.rootEl = rootEl;
        this.searchEl = searchEl;
        this.addBtn = addBtn;
        this.addBtn.addEventListener('click', () => {
            this.logIn()
        });
        this.init();
    }

    logIn() {
        this.rootEl.innerHTML = `
        <form class="form-group">
        <fieldset class="form-group">
        <legend>Войдите в свой аккаунт</legend>
         <label for="email" class="form-group">Введите эл.почту</label>
        <input type="email" class="form-control" id="email" placeholder="email@email.com">
        <label for="password" class="form-group">Введите пароль</label>
        <input type="password" class="form-control" id="password" placeholder="****">
        
        <div class="form-group mt-3">
        
        <button class="btn btn-primary float-right" id="logIn">Войти</button>
        <button class="btn float-left border-primary" id="signIn">Нет аккаунта?</button>
</div>
</fieldset></form>
   `;
        const emailEl = document.getElementById('email');
        const passwordEl = document.getElementById('password');

        document.getElementById('signIn').addEventListener('click', e => {
            e.preventDefault();
            this.signIn()
        });

        document.querySelector('#logIn').addEventListener('click', evt => {
            evt.preventDefault();
            ads.authorization(emailEl.value, passwordEl.value, (data) => {
                console.log(data.id);
                if (data.id === null) {
                    const error = document.createElement('p');
                    error.innerHTML = `<p style="color: red">${data.response}</p>`;
                    this.rootEl.appendChild(error);

                    emailEl.addEventListener('input', () => {
                        this.rootEl.removeChild(error)
                    });
                    passwordEl.addEventListener('input', () => {
                        this.rootEl.removeChild(error)
                    });
                }
                if (data.id !== null) {
                    loading(this.rootEl);
                    setTimeout(() => {
                        this.addNewAd(data)
                    }, 500);

                }


            });


        })
    }

    signIn() {
        this.rootEl.innerHTML = `       
<form class="form-group">
<fieldset class="form-group">
<legend>Зарегистрируйтесь</legend>
<label for="name" class="form-group">Имя</label>
<input type="text" id="name" class="form-control">
<label for="email" class="form-group">Эл. почта</label>
<input type="email" id="email" class="form-control">
<label for="tel" class="form-group">Телефон</label>
<input type="tel" id="tel" class="form-control">
<label for="password" class="form-group">Пароль</label>
<input type="password" id="password" class="form-control">
<label for="pass-word" class="form-group">Пароль ещё раз</label>
<input type="password" id="pass-word" class="form-control">
<button class="btn btn-primary mt-3" id="signIn">Зарегистрироваться</button>
</fieldset>
</form>`;
        const name = document.getElementById('name');
        const password = document.getElementById('password');
        const tel = document.getElementById('tel');
        const email = document.getElementById('email');

        document.getElementById('signIn').addEventListener('click', ev => {
            ev.preventDefault();
            console.log(name.value, password.value, tel.value, email.value);
            ads.addNewSeller(
                name.value,
                password.value,
                tel.value,
                email.value,
                (seller) => {
                    loading(this.rootEl);
                    console.log(seller);
                    setTimeout(() => {
                        this.addNewAd(seller)
                    }, 500)
                }
            );
            // console.log(seller);
        })

    }

    init() {
        // todo: parse current url


        loading(this.rootEl);
        setTimeout(this.ads.getItems(items => {

            this.viewLastAds(items);

            this.searchEl.addEventListener('input', () => {
                loading(this.rootEl);
                setTimeout(() => {
                    window.onpopstate = ev => {
                        console.log(ev);
                        this.searchItems(ev.state.string, ev.state.items)
                    };
                    history.pushState(
                        {
                            string: this.searchEl.value,
                            items: items
                        }
                        , `${this.searchEl.value}`, ``);
                    this.searchItems(this.searchEl.value, items)
                }, 1000)
            });
        }), 1000);


    }

    viewLastAds(items) {

        window.onpopstate = () => {

            this.viewLastAds(items)
        };
        history.pushState(items, 'Новые объявления', '');


        this.rootEl.innerHTML = `    <div class="mt-3">
                    <b><h4>Новые объявления:</h4> </b></div>
                    <p>Всего объявлений: ${items.length}</p>
                <div class="card-deck" id=""> </div>`;
        const cardDeck = document.querySelector('.card-deck');

        this.viewCardDeck(items, cardDeck);
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

    viewItem(o) {

        history.pushState(o, `${o.brand} ${o.model}, ${o.year}`, `${o.brand}${o.model}${o.year}.html`);

        this.ads.getSellers(sellers => {
            const seller = sellers.filter(seller => seller.id === o.sellerId)[0];
            console.log('seller', seller);
            this.rootEl.textContent = '';
            this.rootEl.innerHTML = `
            <h3 class="">${o.brand} ${o.model}, ${o.year}</h3>
            <img class="mt-3" width="100%" src=${o.photos[0]} alt=${o.brand}${o.model}${o.year} id="gallery">
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
            <p class="mt-3">${formateDate(o.date)}</p>
            `;
            const showPhone = document.getElementById('showPhone');
            showPhone.addEventListener('click', () => {
                showPhone.innerHTML = `<h4>${seller.phoneNumber}</h4>`;
                showPhone.className = 'btn';
            })
            const gallery = document.getElementById('gallery');
            let index = 0;
            gallery.addEventListener('click', () => {
                index++;
                if (index === o.photos.length) {
                    index = 0
                }
                gallery.src = o.photos[index];
                console.log(index);
            })
        });
    }

    searchItems(string, items) {
        if (string === '') {
            return this.viewLastAds(items)
        }
        string = string.toLowerCase();
        console.log('search', string);
        const re = new RegExp(string);
        console.log(re);
        let filteredItems = [];
        items.map(o => {
            const obj = `${o.brand} ${o.model} ${o.year} ${o.text}`.toLowerCase();
            // console.log(typeof obj);
            const searchedItems = re.exec(obj);
            // console.log(searchedItems);
            if (searchedItems !== null) {
                filteredItems.push(o)
            }
        });

        this.rootEl.innerHTML = `    <div class="mt-3">
                    <b><h4>Результаты поиска: ${filteredItems.length}</h4> </b></div>
                <div class="card-deck" id=""> </div>`;
        const cardDeck = document.querySelector('.card-deck');

        this.viewCardDeck(filteredItems, cardDeck);
    }


    addNewAd(seller) {

        this.rootEl.innerHTML = `<h4 class="mt-3">Новое объявление</h4>
            
          <div class="container">
    <div class="row">
        <div class="col">
            <form>

                <div class="form-group">
                    <label for="brand">Выберите марку</label>
                    <select class="form-control" id="brand">
                        <option></option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="model">Выберите модель</label>
                    <select class="form-control" id="model" disabled>
                    </select>
                </div>

                <div class="form-group">
                    <label for="year">Год выпуска</label>
                    <select class="form-control" id="year">
                        <option></option>
                        <option>2019</option>
                        <option>2018</option>
                        <option>2017</option>
                        <option>2016</option>
                        <option>2015</option>
                        <option>2014</option>
                        <option>2013</option>
                        <option>2012</option>
                        <option>2011</option>
                        <option>2010</option>
                        <option>2009</option>
                        <option>2008</option>
                        <option>2007</option>
                        <option>2006</option>
                        <option>2005</option>
                        <option>2004</option>
                        <option>2003</option>
                        <option>2002</option>
                        <option>2001</option>
                        <option>2000</option>

                    </select>
                </div>
                <div class="form-group">
                    <label for="km">Пробег (км)</label>
                    <select  class="form-control" id="km">
                    <option></option>
                    <option>0 - 10 тысяч</option>
                    <option>10 - 50 тысяч</option>
                    <option>50 - 100 тысяч</option>
                    <option>100 - 150 тысяч</option>
                    <option>150 - 200 тысяч</option>
                    <option>более 200 тысяч</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="gearbox">Коробка передач</label>
                    <select class="form-control" id="gearbox" >
                        <option></option>
                        <option>Механика</option>
                        <option>Автомат</option>
                        <option>Робот</option>
                        <option>Вариатор</option>
                    </select>
                </div>
                <div class="form-group">
                <label for="price">Цена (руб)</label>
                <input type="number" id="price" class="form-control">
                </div>
                  <div class="form-group">
                    <label for="text">Подробнее</label>
                    <textarea class="form-control" id="text" rows="4"></textarea>
                </div>
                  <div class="form-group">
                <label for="name">Как к Вам обращаться</label>
                <input type="text" id="name" value="${seller.name}" disabled class="form-control">
                </div>
                  <div class="form-group">
                <label for="tel">Номер телефона</label>
                <input type="text" id="tel" value="${seller.phoneNumber}" disabled class="form-control">
                </div>
                <div class="form-group">
                    <label for="photo">Добавьте фото</label>
                    <input type="file" class="form-control-file" id="photo" aria-describedby="fileHelp">
<!--                    <small id="fileHelp" class="form-text text-muted">This is some placeholder block-level help text for-->
<!--                        the above input. It's a bit lighter and easily wraps to a new line.-->
<!--                    </small>-->
                </div>
                <div class="row" id="photos"></div>

                <button id="continue" class="btn btn-primary float-right">Продолжить</button>
                </form>
                </div>
                </div>
                </div>
                `;
        const previews = [];

        const photosEl = document.querySelector('#photos');
        const inputEl = document.querySelector('#photo');
        const data = [];
        inputEl.addEventListener('change', async () => {
            const file = inputEl.files[0];
            // console.log(file);
            previews.push(file);
            photosEl.innerHTML ='';
            previews.map((file,index)=>{
                const img = new Image(100);
                img.src = window.URL.createObjectURL(file);
                img.onload = function () {
                    window.URL.revokeObjectURL(this.src);
                };

                const photoEl = document.createElement('div');
                photoEl.appendChild(img);
                photoEl.className = 'm-1';
                photosEl.appendChild(photoEl);
                const removePhotoBtn = document.createElement("button");
                removePhotoBtn.textContent = 'x';
                removePhotoBtn.className = 'btn btn-sm btn-danger';

                photoEl.appendChild(removePhotoBtn);
                removePhotoBtn.addEventListener('click', ev => {
                    ev.preventDefault();
                    previews.splice(index,1);
                    photosEl.removeChild(photoEl)
                })
            });
            // console.log(data);


            data.push(await readFile(file));
            function readFile(blob) {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.addEventListener('load', ev => {
                        resolve(fileReader.result);
                    });
                    fileReader.addEventListener('error', ev => {
                        reject('error');
                    });
                    fileReader.readAsDataURL(blob);
                })
            }


        });

        const brandEl = document.getElementById('brand');
        const modelEl = document.getElementById('model');

        cars.map(
            car => brandEl.appendChild(new Option(car.name))
        );

        brandEl.addEventListener('input', () => {
            modelEl.innerHTML = '';
            modelEl.appendChild(new Option(''));
            if (brandEl.value !== '') {
                modelEl.disabled = false;
                defineOptions(brandEl.value, modelEl)
            } else {
                modelEl.disabled = true
            }
        });

        document.getElementById('continue').addEventListener('click', (ev) => {
            ev.preventDefault();
            // photosEl.querySelectorAll("img").forEach(img =>{
            //     console.log(img.src);
            // });
            const newAd = new Ad(
                brandEl.value,
                modelEl.value,
                document.getElementById('year').value,
                document.getElementById('km').value,
                document.getElementById('gearbox').value,
                document.getElementById('text').value,
                document.getElementById('price').value,
                seller.id,
                [...data]
            );
            console.log(newAd);
            this.ads.addNewItem(newAd, (item) => {
                this.viewItem(item)
            })
        })
    }
}

const app = new App(ads,
    document.getElementById('root'),
    document.getElementById('addBtn'),
    document.getElementById('search'),
);

console.log(app);


