document.addEventListener("DOMContentLoaded", () => {

    let generateBtn = document.querySelector('#generate-pokemon');
    let deleteBtn = document.querySelector('#del-btn');
    let findCounterBtn = document.querySelector('#find-counter-btn');

    generateBtn.addEventListener('click', renderEverything);
    deleteBtn.addEventListener('click', deleteEverything);
    findCounterBtn.addEventListener('click', findCounterPokemon);
})

function Capitalize(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
}

function renderEverything() {
    let allPokemonContainer = document.querySelector('#poke-container')
    allPokemonContainer.innerText = "";
    fetchHoennPokemon();
}

function fetchHoennPokemon() {

    fetch('https://pokeapi.co/api/v2/pokedex/hoenn')
        .then((response) => response.json())
        .then((json) => {
            json.pokemon_entries.forEach(item => {
                let url = item.pokemon_species.url;
                url = url.replace('-species', '');
                fetchPokemonData(url);
            });     
        });

}

function fetchPokemonData(url) {
    fetch(url)
        .then(response => response.json())
        .then(function (pokeData) {
            renderPokemon(pokeData)
        })
}

function renderPokemon(pokeData) {

    const template = document.getElementById("card-template").content.cloneNode(true);
    template.querySelector('.card-img-top').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeData.id}.png`;
    template.querySelector('.pokemonName').innerText = Capitalize(pokeData.name);
    template.querySelector('.pokemonNumber').innerText = `#${pokeData.id}`;
    let pokeTypes = template.querySelector('.pokemonTypes');
    createTypes(pokeData.types, pokeTypes)

    let cardList = document.querySelector("#poke-container")
    cardList.append(template);
}

function colourSwitch(colour) {
    switch (colour) {
        case "normal":
            return 'A8A77A';
        case "fire":
            return 'EE8130';
        case "water":
            return '6390F0';
        case "electric":
            return 'F7D02C';
        case "grass":
            return '7AC74C';
        case "ice":
            return '96D9D6';
        case "fighting":
            return 'C22E28';
        case "poison":
            return 'A33EA1';
        case "ground":
            return 'E2BF65';
        case "flying":
            return 'A98FF3';
        case "psychic":
            return 'F95587';
        case "bug":
            return 'A6B91A';
        case "rock":
            return 'B6A136';
        case "ghost":
            return '735797';
        case "dragon":
            return '6F35FC';
        case "dark":
            return '705746';
        case "steel":
            return 'B7B7CE';
        case "fairy":
            return 'D685AD';
        default:
            return 'A8A77A';
    }
}

function createTypes(types, wrapper) {
    types.forEach(function (type) {
        let div = document.createElement('div');
        div.innerHTML = type['type']['name'];
        div.id = type['type']['name'];
        let colour = colourSwitch(type['type']['name']);
        div.setAttribute("class", 'col-6', 'col-sm-12', 'col-lg-3')
        div.style = `text-align:center; background:#${colour};`
        wrapper.append(div);
    })
}

function deleteEverything() {
    let container = document.querySelector('#container')
    container.innerHTML = '';
    container.innerHTML = '<div id="poke-container"> </div>';
}

function initSearchableArray() {
    let stringArray = [];
    let urlArray = [];

    fetch('https://pokeapi.co/api/v2/pokedex/hoenn')
        .then((response) => response.json())
        .then((json) => {
            json.pokemon_entries.forEach(item => {
                let url = item.pokemon_species.url;
                url = url.replace('-species', '');
                let str = Capitalize(item.pokemon_species.name);
                stringArray.push(str);
                urlArray.push(url);
            });
        });

    return [stringArray, urlArray];
}

function fillDropdown(pokemon_name, url, form) {
    let typeOption = document.createElement('li');
    typeOption.innerHTML = `<a class="dropdown-item" href="#" value="${url}">${pokemon_name}</a>`;
    form.append(typeOption);
}

function initDropdown() {

    let form = document.querySelector('.dropdown-menu');

    fetch('https://pokeapi.co/api/v2/pokedex/hoenn')
        .then((response) => response.json())
        .then((json) => {
            json.pokemon_entries.forEach(item => {
                let url = item.pokemon_species.url;
                url = url.replace('-species', '');
                let str = Capitalize(item.pokemon_species.name);
                fillDropdown(str, url, form);
            });
        });

}

initDropdown();

let dropdownMenu = document.querySelector(".dropdown-menu");

function selectPokemon(url) {
    deleteEverything();
    fetchPokemonData(url);
};

dropdownMenu.addEventListener('click', () => {
    var listItems = dropdownMenu.querySelectorAll(".dropdown-item"); // this returns an array of each li

    listItems.forEach(function (item) {
        item.onclick = function (e) {
            let url = item.getAttribute('value');
            selectPokemon(url);
        }
    });
});

/////////////

let searchable = initSearchableArray();
const searchInput = document.getElementById('search');
const searchWrapper = document.querySelector('.wrapper');
const resultsWrapper = document.querySelector('.results');

searchInput.addEventListener('keyup', () => {
    let results = [];
    let input = searchInput.value;
    if (input.length) {

        //item.toLowerCase().includes(input.toLowerCase());

        results = searchable[0].filter((item) => {
            return item.toLowerCase().includes(input.toLowerCase());
        });
    }
    renderResults(results);
});



resultsWrapper.addEventListener('click', () => {
    var listItems = searchWrapper.querySelectorAll("ul li"); // this returns an array of each li

    listItems.forEach(function (item) {
        item.onclick = function (e) {
            searchInput.value = this.innerHTML;
            let indexPosition = searchable[0].indexOf(this.innerHTML);
            let url = searchable[1][indexPosition];
            searchInput.name = url;
            searchPokemon();
            renderResults([]); //clear results
            resultsWrapper.style="outline:0px black solid;";
        }
    });
});


function renderResults(results) {

    if (!results.length) {
        return searchWrapper.classList.remove('show');
    }

    results = results.slice(0, 10); //limit results to 5

    const content = results
        .map((item) => {
            return `<li>${item}</li>`;
        })
        .join('');

    searchWrapper.classList.add('show');
    resultsWrapper.innerHTML = `<ul>${content}</ul>`;
    resultsWrapper.style="outline:1px black solid;";
}

function searchPokemon() {
    selectPokemon(searchInput.name);
}

function typeCounterSwitch(type) {
    switch (type) {
        case "normal":
            return 'fighting';
        case "fire":
            return 'water';
        case "water":
            return 'electric';
        case "electric":
            return 'ground';
        case "grass":
            return 'fire';
        case "ice":
            return 'fire';
        case "fighting":
            return 'flying';
        case "poison":
            return 'ground';
        case "ground":
            return 'water';
        case "flying":
            return 'rock';
        case "psychic":
            return 'ghost';
        case "bug":
            return 'fire';
        case "rock":
            return 'water';
        case "ghost":
            return 'dark';
        case "dragon":
            return 'fairy';
        case "dark":
            return 'fighting';
        case "steel":
            return 'ground';
        case "fairy":
            return 'poison';
        default:
            return 'normal';
    }
}


function findCounterPokemon() {

    let pokeContainer = document.querySelector('#poke-container');
    if (pokeContainer.children.length == 1) {
        alert('Finding Counters......')
        let typesContainer = pokeContainer.querySelector('.pokemonTypes');
        let typeCounter = typeCounterSwitch(typesContainer.querySelector("div").id);
        renderCounters(typeCounter);
    } else {
        alert('Please select one pokemon to find a counter for!!!');
        deleteEverything();
    }
}

function renderCounters(typeCounter){

    searchable[1].forEach(item => {
        fetch(item)
            .then(response => response.json())
            .then(function (pokeData) {
                pokeData.types.forEach((type) => {
                    let counter = type['type']['name'];
                    if(counter==typeCounter){
                        fetchPokemonData(item);
                    }
                })
            });
    })

}
