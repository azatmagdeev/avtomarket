export class Ads {
    constructor() {
        this.apiUrl = 'https://avito-back.herokuapp.com/';
        this.items = [];
        this.sellers = [];
    }

    getItems(success) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.apiUrl}`);
        xhr.addEventListener('load', () => {
            this.items = JSON.parse(xhr.responseText);
            success(this.items);
        });
        xhr.send();
    }

    getSellers(success) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.apiUrl}sellers`);
        xhr.addEventListener('load', () => {
            this.sellers = JSON.parse(xhr.responseText);
            success(this.sellers);
        });
        console.log('this.sellers', this.sellers);
        xhr.send();
    }

    addNewSeller(name, password, phoneNumber, email, success) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.apiUrl}sellers`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('load', () => {
            success(JSON.parse(xhr.responseText))
        });
        const newSeller = {
            name: name,
            password: password, phoneNumber: phoneNumber, email: email
        };
        xhr.send(JSON.stringify(newSeller))
    }

    authorization(email,password,success){
        const xhr = new XMLHttpRequest();
        xhr.open('POST',`${this.apiUrl}authorization`);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.addEventListener('load',()=>{
            success(JSON.parse(xhr.responseText))
        });
        const data = {
            email: email,
            password: password
        };
        xhr.send(JSON.stringify(data))
    }
}

export function formateDate(i) {
    const date = new Date(i);
    return `размещено ${date.getDate()}.${date.getMonth()}.${date.getFullYear()} в ${date.getHours()}:${date.getMinutes()}.`
}


export function loading(root) {
    root.innerHTML = `<img src="img/load.gif" width="100%" alt="Загрузка...">`
}