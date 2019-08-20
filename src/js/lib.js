export class Ads{
    constructor(){
        this.apiUrl = 'https://avito-back.herokuapp.com/';
        this.items = [];
        this.sellers = [];
    }

    getItems(success){
        const xhr = new XMLHttpRequest();
        xhr.open('GET',`${this.apiUrl}`);
        xhr.addEventListener('load',()=>{
            this.items = JSON.parse(xhr.responseText);
            success(this.items);
        });
        xhr.send();
    }
}