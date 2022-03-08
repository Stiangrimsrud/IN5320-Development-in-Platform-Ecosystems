countryDict = {}
validCountries = []
var list = []
var item = []


function checkEmptyInput() {
    var inputCountry= document.getElementById(inputCountry)
    countryString = inputCountry.value

    if(countryString) {
        if(valdiCountries.includes(countryString)){
            addNewListElement(countryString)
        } else {
            alert(countryString + "is not a valid country")
        }
        inputCountry.value = ""
    }
}

function addNewListElement(inputFromUser, saveInLS = true){
    getPopulationCountry(inputFromUser).then(data =>{
        let populationtoday = data["total_population"][0]["population"]
        let populationtomorrow = data["total_population"][1]["population"]

        list  = document.getElementById("list")
        item = document.createElement("li")
        item.setAttribute('id', "countryString")

        span = document.createElement("span")
        span.innerText = inputFromUser
        item.appendChild(span)

        populationSpan = document.createElement("span")
        populationSpan.innerText = populationtoday
        item.appendChild(populationSpan)

        var button = document.createElement("button")
        var text = document.createTextNode("Delete")
        button.appendChild(text)
        item.appendChild(button)
        item.setAttribute("id", "deleteButton")
        list.appendChild(item)

        populaationDifferencePerDay = populationtomorrow - populationtoday
        populationIncreasePerSecond = populaationDifferencePerDay / 86400
        secondsBetweenUpdate = 1 / populationIncreasePerSecond
        ms = secondsBetweenUpdate * 1000

        function increasePopByOne(){
            populationSpan.innerText = parseInt(populationSpan.innerText) + 1
        }

        setInterval(increasePopByOne, ms)

        countryDict[inputFromUser] = item
        if(saveInLS){
            allCountries = Object.keys(countryDict)
            localStorage.setItem("country", allCountries)
        }

        button.addEventListener('click', deleteItemFromList, false)

    }).catch(e =>{
        console.log(e)
    })
}

function deleteItemFromList() {
    deleteditem = this.parentNode.children[0].innerText
    countryDict[deleteditem].remove()
    delete countryDict[deleteditem]
    newListOfCountries = Object.keys(countryDict)
    localStorage.setItem("country", newListOfCountries)
}


function searchWordMatch(element, searchWord){
    return element.toLowerCase().startsWith(searchWord.toLowerCase())
}

function searchList(list, searchWord){
    newList = []
    for (i = 0; i < list.length; i++){
        if(searchWordMatch(list[i], searchWord)){
            newList.push(list[i])
        }
    }
    return newList
}

function populateUIWithInput(){
    allCountries = Object.keys(countryDict)
    var input = document.getElementById('inputCountry').value

    matchedCountries = searchList(allCountries, input)

    for(i = 0; i < allCountries.length; i++){
        if(matchedCountries.includes(allCountries[i])){
            countryDict[allCountries[i]].style.display = "list-item"
        } else {
            countryDict[allCountries[i]].style.display = "none"
        }
    }
    
}


function setUpFromLS(){
    countries = localStorage.getItem("country")
    if (countries.length){
        countriesList = countries.split(",")
        countriesList.map(addNewListElement)
    }
}

async function getCountry(){
    let response = await fetch("https://d6wn6bmjj722w.population.io/1.0/countries/")
    let data = await response.json()
    console.log(data)
    return data
}

async function getPopulationCountry(countryString){
    let url = "https://d6wn6bmjj722w.population.io/1.0/population/"+ countryString+
    "/today-and-tomorrow/"
    let response = await fetch(url)
    let data = await response.json()
    return data
}

getCountry().then(data => {
    validCountries = data["countries"]
    setUpFromLS()
}).catch(e =>{
    console.log(e)
})