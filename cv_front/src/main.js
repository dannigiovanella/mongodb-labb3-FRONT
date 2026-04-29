"use strict";

//Hämtar API URL. Används i alla requests 
const API_URL = "https://mongodb-labb3-back.onrender.com/workexperience";


// VALIDERING

//Funktion validerar formulär-inupt och skapar felmeddelande
function validateForm() {

    // Rensar gamla felmeddelanden innan ny validering
    document.getElementById("jobtitle-error").textContent = "";
    document.getElementById("companyname-error").textContent = "";
    document.getElementById("location-error").textContent = "";
    document.getElementById("startdate-error").textContent = "";
    document.getElementById("enddate-error").textContent = "";
    document.getElementById("description-error").textContent = "";


    // Variabel för om fält är tomt eller ej. Sätts till false om nåt är fel
    let isCorrect = true;

    //Hämtar id och dess värde för inputfält. trim tar bort onödiga mellanslag
    const jobtitle = document.getElementById("jobtitle").value.trim();
    const companyname = document.getElementById("companyname").value.trim();
    const location = document.getElementById("location").value.trim();
    const startdate = document.getElementById("startdate").value;
    const enddate = document.getElementById("enddate").value;
    const description = document.getElementById("description").value.trim();

    // Kontroll för skriva ut felmeddelande om fälten är tomma.
    // Individuella felmedellanden för varje fält

    // Jobbtitel
    if (!jobtitle) {
        document.getElementById("jobtitle-error").textContent = "Fyll i roll";
        isCorrect = false;
    }
    // Företagsnamn
    if (!companyname) {
        document.getElementById("companyname-error").textContent = "Fyll i företag";
        isCorrect = false;
    }
    // Plats
    if (!location) {
        document.getElementById("location-error").textContent = "Fyll i plats";
        isCorrect = false;
    }
    // Startdatum
    if (!startdate) {
        document.getElementById("startdate-error").textContent = "Fyll i startdatum";
        isCorrect = false;
    }
    // Slutdatum
    if (!enddate) {
        document.getElementById("enddate-error").textContent = "Fyll i slutdatum";
        isCorrect = false;
    }
    // Beskrivning
    if (!description) {
        document.getElementById("description-error").textContent = "Fyll i beskrivning";
        isCorrect = false;
    }

    // Returnerar resultatet av valideringen
    return isCorrect;
}



// LÄGG TILL DATA I API

//Hämtar id för formulär
const form = document.getElementById("workform");

//Eventlyssnar som lyssnar till klick av "Lägg till"-knapp
//Kontroll för att bara inkludera sida med form 
if (form) {
    form.addEventListener("submit", async (event) => {

        // Stoppar sidan från att ladda om
        event.preventDefault();

        // Hämtar värden från formuläret
        const companyname = document.getElementById("companyname").value;
        const jobtitle = document.getElementById("jobtitle").value;
        const location = document.getElementById("location").value;
        const startdate = document.getElementById("startdate").value;
        const enddate = document.getElementById("enddate").value;
        const description = document.getElementById("description").value;

        // Validering - Kollar så att fälten är ifyllda genom funktion för validering
        const formIsCorrect = validateForm();

        if (formIsCorrect === false) {
            //Stoppar submit om nåt är fel. Felmeddelande från validate funktion skrivs ut
            return;
        }

        //Skapar objekt att skicka till API
        const newWorkexperience = {
            companyname,
            jobtitle,
            location,
            startdate,
            enddate,
            description
        };

        //Postar till API
        try {

            //Postar till API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                //Konverterar objekt till JSON
                body: JSON.stringify(newWorkexperience)
            });

            const data = await response.json();

            //Feedback till användare om att pot är sparad
            alert("Arbetserfarenhet sparad!");

            // Tömmer formuläret efter lyckad save
            form.reset();


        } catch (error) {
            console.error("Fel vid POST:", error);
        }
    });
}

//1. HÄMTA DATA

//Funktion hämtar data från API
async function getWorkExperience() {
    try {
        // Gör ett anrop till backend (API)
        const response = await fetch(API_URL);

        // Omvandlar svaret till js-array
        const data = await response.json();


        // Skickar data till funktion som visar poster
        showWorkexperience(data);


    } catch (error) {
        // Om något går fel 
        console.error("Fel vid hämtning:", error);
    }
}


//2. VISA DATA

//Funktion för att visa sparade poster i gränssnitt
async function showWorkexperience(data) {

    // Hämtar container i HTML
    const cvContainer = document.getElementById("workexperience-list");

    //Kontroll för att exkludera sidorna som inte är relevanta 
    if (!cvContainer) return;

    // Tömmer tidigare innehåll
    cvContainer.innerHTML = "";

    // Loopar igenom varje post och skapar element
    data.forEach(workPost => {

        // Skapar en div (card) för individuella poster
        const card = document.createElement("div");
        //skapar klass för div
        card.classList.add("card");


        // Arbetsroll. Skapar h3
        const jobRole = document.createElement("h3");
        jobRole.textContent = workPost.jobtitle;

        //Start och slutdatum
        //Har lagt en split för att få bort tiden från date så bara datum visas
        //Delar upp vid T= där tid börjar, i två delar (i en lista)
        //[0] - Tar första värdet listan (datum)
        const start = workPost.startdate.split("T")[0];
        const end = workPost.enddate.split("T")[0];

        const dates = document.createElement("p");
        dates.textContent = `${start} - ${end}`;

        // Företagsnamn. Skapar p
        const company = document.createElement("p");
        company.innerHTML = `<strong>Företag:</strong> ${workPost.companyname}`;


        // Plats. Skapar p
        const location = document.createElement("p");
        location.innerHTML = `<strong>Plats:</strong> ${workPost.location}`;

        // Jobb beskrivning
        const descript = document.createElement("p");
        descript.textContent = workPost.description;

        // TA BORT POST
        //Skapar en wrapper för knapp (för styling)
        const buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("button-wrapper");

        //Skapar knapp
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Ta bort";
        //Skapar klass för knapp
        deleteButton.classList.add("delete-button");


        // Eventlyssnare som anpropar delete-funktion vid klick
        //Plockar ut post via ID
        deleteButton.addEventListener("click", () => {
            deleteWorkPost(workPost._id);
        });

        //Lägger knapp i wrapper
        buttonWrapper.appendChild(deleteButton);

        // Lägger till element i div (card)
        card.appendChild(jobRole);
        card.appendChild(dates);
        card.appendChild(company);
        card.appendChild(location);
        card.appendChild(descript);
        card.appendChild(buttonWrapper);

        // Lägger till div (card) i workexperience-list
        cvContainer.appendChild(card);
    });
}

//Anropar funktion för att hämta data. (via show-funktion)
getWorkExperience();

//3. TA BORT POST

//Funktion tar bort sparad post baaserat på ID
async function deleteWorkPost(id) {

    try {
        // Skickar DELETE request till backend
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        // Kontroll för om post finns
        if (response.status === 404) {
            console.log("Posten finns inte");
            return;
        }

        //Logg för att se om post är raderad
        console.log("Raderad:", id);

        // Uppdaterar listan i gränssnitt med funktion som hämtar data
        getWorkExperience();

    } catch (error) {
        console.error("Fel vid delete:", error);
    }

}
