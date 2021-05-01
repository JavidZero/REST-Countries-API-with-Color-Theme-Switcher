const mode = document.querySelector(".container .header .wrapper .flex .header-mode");
const url = "https://restcountries.eu/rest/v2/all";
const filterSelect = document.querySelector(".container .main .wrapper .homePage .homePageheader .flex .homePageFilter .homePageFilterSelect");
const countriesContainer = document.querySelector(".container .main .wrapper .homePage .homePageMain");
const searchBoxInput = document.querySelector(".container .main .wrapper .homePage .homePageheader .flex .homePageSearchBox .homePageSearchInput");
const searchBoxButton = document.querySelector(".container .main .wrapper .homePage .homePageheader .flex .homePageSearchBox .homePageSearchButton");

let allCountries = [];
let filters = ['All'];
let selectedFilter = 'All';

class APICountries {
    async getCountries(){
        try{
            let result = await fetch(url);
            result = await result.json();
            let countries = result.map(country=>{
                const  name = country.name;
                const  alpha3Code = country.alpha3Code;
                const  flag = country.flag;
                const  nativeName = country.nativeName
                const  population = country.population
                const  region = country.region;
                const  subregion = country.subregion;
                const  capital = country.capital;
                const  domains = country.topLevelDomain;
                const  currencies = country.currencies;
                const  languages = country.languages;
                const  borders = country.borders;

                return { name, alpha3Code, flag, nativeName,
                     population, region, subregion, capital,
                    domains, currencies, languages, borders}
            })

            return countries;

        }catch(event){
            console.log(event.message);
        }
    }
}

class UI {

    getFilters(countries){
        countries.forEach((country) => {
            if (filters.indexOf(country.region) == -1 && country.region != "") {
                filters=[...filters, country.region];
            }
        })
    }

    showFilters(countries){
        this.getFilters(countries);

        let selects = [];

        let selectContainer = document.createElement('select');
        selectContainer.classList.add('homePageFilterSelect');
        
        filters.forEach(filter=>{
            let selected = (selectedFilter==filter)? 'selected':'';
            
            let str = `
                <option value="${filter}" ${selected}>${filter}</option>
            `;

            selects = [...selects, str];
        })

        selects = selects.join('');
        filterSelect.innerHTML = selects;

    }

    getsearchEvent(){

        searchBoxButton.addEventListener('click',()=>{
            this.makeSearchEvent();
        })

        searchBoxInput.addEventListener('keyup',(event)=>{
            if(event.keyCode == 13){
                this.makeSearchEvent();
            }
        })
    }

    makeSearchEvent(){
        let value='';
        value = searchBoxInput.value;
        value = this.capitalize(value);
        searchBoxInput.value = '';

        if(value!=''){
            let country = this.findCountryByName(value);
            if (country == undefined) {
                alert('No Such country');
            }
            else {
                window.location.href = `country.html?name=${value}`;
            }
        }

    }

    capitalize(value){
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    findCountryByName(name){
        return allCountries.find(country=>country.name===name);
    }

    getFilterEvent(){
        filterSelect.addEventListener('change', (event) => {
            console.log('Filtered');
            selectedFilter = event.target.value;
            if(selectedFilter=='All'){
                this.showCountries(allCountries)
            }
            else {
                let countries = this.getFilteredCountries(selectedFilter);
                this.showCountries(countries);
            }
        })
    }

    getFilteredCountries(filter){
        return allCountries.filter(country=>country.region==filter);
    }

    showCountries(countries){

        while (countriesContainer.children.length > 0) {
            countriesContainer.removeChild(countriesContainer.children[0]);
        }

        countries.forEach((country) => {
            const div = document.createElement('div');
            div.classList.add('country-item');
            div.dataset.name = country.name;
            div.innerHTML = `
                <div class="country-image">
                    <img src="${country.flag}" alt="">
                </div>
                <div class="country-info">
                    <h4>${country.name}</h4>
                    <div class="country-info-text">
                        <p class="country-info-name">Population:
                            <span class="country-info-detail"> ${country.population}</span>
                        </p>
                    </div>
                    <div class="country-info-text">
                        <p class="country-info-name">Region:
                            <span class="country-info-detail"> ${country.region}</span>
                        </p>
                    </div>
                    <div class="country-info-text">
                        <p class="country-info-name">Capital:
                            <span class="country-info-detail"> ${country.capital}</span>
                        </p>
                    </div>
                </div>
            `;

            countriesContainer.appendChild(div);
        })
    
        this.getsearchEvent();
        this.getFilterEvent();
        this.getCountryEvent();
    }

    getCountryEvent(){
        const allCountryComponent = [...document.querySelectorAll(".country-item")];

        allCountryComponent.forEach((country)=>{
            country.addEventListener('click',()=>{
                let name = country.dataset.name;
                window.location.href = `country.html?name=${name}`;
            })
        })
    }
}

class Storage {
    static saveCountries(countries) {
        localStorage.setItem('countries', JSON.stringify(countries));
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    const apicountries  = new APICountries();
    const ui = new UI();

   apicountries.getCountries().then(countries=>{
       {   
           allCountries = countries;
           ui.showFilters(countries);
           ui.showCountries(countries);
           Storage.saveCountries(countries);
       }
   });
})


mode.addEventListener('click', ()=>{
    document.querySelector(".container").classList.toggle("light");
})


