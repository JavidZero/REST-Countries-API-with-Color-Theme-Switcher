const countryComponent = document.querySelector(".container .main .wrapper .details-page .country-details");
const countryBorders = document.querySelector(".container .main .wrapper .details-page .country-details .flex .details-page-border-box .details-page-border-items .details-page-border-item");
const backButton = document.querySelector(".container .main .wrapper .details-page .details-page-button-back");
 

let allCountries = [];
let parameter = ''

class Storage {
    static getCountries(){
        return JSON.parse(localStorage.getItem('countries'));
    }
}

class Country {
    getCountry(){

        let queryStr = window.location.search;
        let params = new URLSearchParams(queryStr);
        let paramName = params.get('name');
    
        return paramName;
    }
}

class UI {
    displayCountry(countryName){

        let country =  this.findCountryByName(countryName);
        
        let currencies = this.displayItems(country.currencies);
        let languages = this.displayItems(country.languages);
        let borders = this.displayBorders(country.borders);
        let domains = country.domains.join(',');

        const div = document.createElement('div');
        div.classList.add('flex');
        div.innerHTML = `
        <div class="details-page-picture">
            <img src="${country.flag}" alt="">
        </div>
        <div class="details-page-info">
            <h1>${country.name}</h1>
            <div class="details-page-info-insider">
                <div class="flex">
                    <div class="details-page-info-insider-left">
                        <p class="details-page-info-name">Native Name:
                            <span class="details-page-info-detail"> ${country.nativeName}</span>
                        </p>
                        <p class="details-page-info-name">Population:
                            <span class="details-page-info-detail"> ${country.population}</span>
                        </p>
                        <p class="details-page-info-name">Region:
                            <span class="details-page-info-detail"> ${country.region}</span>
                        </p>
                        <p class="details-page-info-name">Sub Region:
                            <span class="details-page-info-detail"> ${country.subregion}</span>
                        </p>
                        <p class="details-page-info-name">Capital:
                            <span class="details-page-info-detail"> ${country.capital}</span>
                        </p>
                    </div>

                    <div class="detailsPageInfoInsiderRight">
                        <p class="details-page-info-name">Top Level Domain:
                            <span class="details-page-info-detail"> ${domains}</span>
                        </p>
                        <p class="details-page-info-name">Currencies:
                            <span class="details-page-info-detail">${currencies}</span>
                        </p>
                        <p class="details-page-info-name">Languages:
                            <span class="details-page-info-detail">${languages}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="details-page-border-box">
                <p class="details-page-info-name">Border Countries: </p>
                <div class="details-page-border-items">
                    ${borders}
                </div>
            </div>
        </div>
        `;

        if(countryComponent.children.length>0){
            countryComponent.removeChild(countryComponent.children[0]);
        }

        countryComponent.appendChild(div);

        this.bordersEvent();
        this.backButtonEvent();
    }

    displayItems(items){
        let list = [];
        items.forEach((item)=>{
            list = [...list, item.name];
        })

        return list.join(',');
    }

    displayBorders(items){
        let list = [];

        items.forEach((item)=>{
            let country = this.findCountryNameByCode(item);
            
            let str = `
             <button data-name="${country}" class="details-page-border-item">${country}
             </button>
            `;

            list = [...list, str];
        })

        return list.join('');
    }

    findCountryNameByCode(code){
        let borderCountry = allCountries.find((country => country.alpha3Code == code));

        return borderCountry.name;
    }

    findCountryByName(name){
        return allCountries.find((country)=>country.name == name);
    }

    bordersEvent(){
        const borderCountries = [...document.querySelectorAll('.details-page-border-item')];

        borderCountries.forEach((country)=>{
            country.addEventListener('click',()=>{
                let name = country.dataset.name;
                window.location.href = `country.html?name=${name}`;
            })
        })
    }

    backButtonEvent(){
        backButton.addEventListener('click',()=>{
            
            window.history.back();
        })
    }
}


document.addEventListener('DOMContentLoaded', ()=>{

    const countryGetter = new Country();
    const ui = new UI();

    allCountries = Storage.getCountries();

    parameter =countryGetter.getCountry();

    ui.displayCountry(parameter);
})

const mode = document.querySelector(".container .header .wrapper .flex .header-mode");

mode.addEventListener('click', () => {
    document.querySelector(".container").classList.toggle("light");
})