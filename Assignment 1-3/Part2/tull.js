//Creates dictionary, easier to access keys and corresponding values 
countryDictionary = {}
validCountries = []
var list = []
var item = []

//Checks input when button clicked, calls function to create new list element, sets value to "" to clear input field
function checkIfEmptyInput() {
    var inputCountry = document.getElementById("inputCountry")
    countryString = inputCountry.value
    // If countryString isn't empty.
    if(countryString) {
        // If countrystring is a valid country from the API.
        if (validCountries.includes(countryString)){
            addNewListElement(countryString)
        }
        else{
            alert(countryString + " is not a valid country!")
        }
        inputCountry.value=""
    }
}

// Creates a new list element, appends to ul HTML list
function addNewListElement(inputFromUser, saveInLocalStorage=true) {
    getPopulationForCountry(inputFromUser).then(data => {
        let populationToday = data["total_population"][0]["population"]
        let populationTomorrow = data["total_population"][1]["population"]

        list = document.getElementById("listOfCountries")
        item = document.createElement('li')
        item.setAttribute('id', "countryString")

        // Add country span
        span = document.createElement("span")
        span.innerText = inputFromUser
        item.appendChild(span)

        // Add population span
        populationSpan = document.createElement("span")
        populationSpan.innerText = populationToday
        item.appendChild(populationSpan)

        // Add button to delete item
        var button = document.createElement("button")
        var text = document.createTextNode("Delete")
        button.appendChild(text)
        item.appendChild(button)
        item.setAttribute("id", "deleteButton")
        list.appendChild(item)
        
        // Task 7. Find out how often the setInterval should update
        populationDifferencePerDay = populationTomorrow - populationToday
        populationIncreasePerSecond = populationDifferencePerDay / 86400
        secondsBetweenUpdate = 1 / populationIncreasePerSecond
        ms = secondsBetweenUpdate * 1000

        // Increase the contents of the population span by 1 every x ms.
        function increasePopByOne(){
            populationSpan.innerText = parseInt(populationSpan.innerText) + 1
        }
        setInterval(increasePopByOne, ms)

        // Save item(s) to local storage
        countryDictionary[inputFromUser] = item
        if(saveInLocalStorage) {
            allCountries = Object.keys(countryDictionary)
            localStorage.setItem("country", allCountries)
        }

        //If button clicked, call function and delete item from list
        button.addEventListener('click', deleteItemFromList, false)
        })
}

    //Delete element from list when button clicked
    function deleteItemFromList() {
        deletedItem = this.parentNode.children[0].innerText
        countryDictionary[deletedItem].remove()
        delete countryDictionary[deletedItem]
        newListOfCountries = Object.keys(countryDictionary)
        localStorage.setItem("country", newListOfCountries)
    }

    //Returns true if searchWord matches element
    function searchWordMatch(element, searchWord) {
        // toLowerCase for case insensitivity
        return element.toLowerCase().startsWith(searchWord.toLowerCase())
    }

    //When search is true (element matches searchword) add the given 
    //list element to the new list with text 
    function searchList(list, searchWord) {
        newList = []
        for(i = 0; i < list.length; i ++) {
            if(searchWordMatch(list[i], searchWord)) {
                newList.push(list[i])
            }
        }
        return newList
        //let newList = list.filter(listItem => listItem.searchWordMatch(searchWord))
        //return newList
    }

    function populateUlThroughInput() {
        // Get all countries from the dictionary
        allCountries = Object.keys(countryDictionary)
        var input = document.getElementById('inputSearch').value

        // Get countries that match
        matchedCountries = searchList(allCountries, input)

        for( i = 0; i < allCountries.length; i++) {
            if(matchedCountries.includes(allCountries[i])) {
                // Show country
                countryDictionary[allCountries[i]].style.display = "list-item"
            }
            else {
                // Hide country
                countryDictionary[allCountries[i]].style.display = "none"
            }
        }
    }

    // Read from localstorage
    function setUpFromLocalStorage(){
    
        countries = localStorage.getItem("country")
        console.log("førif",countries)
        // Check if localstorage is empty to avoid an empty listelement.
        if (countries.length > 0){ 
            countriesList = countries.split(",")
            countriesList.map(addNewListElement)
        } else {
            console.log("TOMT")
            checkIfEmptyInput()
        }
    }

    // API call to get the valid countries 
    async function getValidCountries(){
        let response = await fetch("https://d6wn6bmjj722w.population.io/1.0/countries/")
        let data = await response.json()
        console.log(data)
        return data
    }
    // API calls for getting the population of a country
    async function getPopulationForCountry(countryString){
        let url = "https://d6wn6bmjj722w.population.io/1.0/population/"+ countryString + "/today-and-tomorrow/"
        let response = await fetch(url)
        let data = await response.json()
        return data
    }

    // Get valid countries into a list before setting up from local storage
    getValidCountries().then(data => {
        validCountries = data["countries"]
        setUpFromLocalStorage()
    }).catch(e =>{
        console.log(e)
    })
