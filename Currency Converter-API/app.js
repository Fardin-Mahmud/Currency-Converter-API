const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "BDT") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value.trim(); // Trim to remove any spaces

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let fromCode = fromCurr.value.toLowerCase().trim();
    let toCode = toCurr.value.toLowerCase().trim();
    const URL = `${BASE_URL}/${fromCode}.json`; // Fetch all rates for 'from' currency

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to fetch exchange rates.`);
        }

        let data = await response.json();
        let rate = data[fromCode][toCode];

        if (!rate) {
            throw new Error("Invalid currency conversion.");
        }

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Please try again.";
        console.error(error);
    }
};

// Flag Update
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});

