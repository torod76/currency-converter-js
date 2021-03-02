const currencies={AUD:"Australian Dollar",BGN:"Bulgarian Lev",BRL:"Brazilian Real",CAD:"Canadian Dollar",CHF:"Swiss Frank",CNY:"Chinese Yuan",CZK:"Czech Republic Koruna",DKK:"Danish Krone",EUR: "Euro", GBP:"British Pound",HKD:"Hong Kong Dollar",HRK:"Croatian Kuna",HUF:"Hungarian Forint",IDR:"Indonesian Rupiah",ILS:"Israeli New Shekel",INR:"Indian Rupee",JPY:"Japanese Yen",KRW:"South Korean Won",MXN:"Mexican Peso",MYR:"Malaysian Ringgit",NOK:"Norwegian Krone",NZD:"New Zealand Dollar",PHP:"Philippine Peso",PLN:"Polish Zloty",RON:"Romanian Leu",RUB:"Russian Ruble",SEK:"Swedish Krona",SGD:"Singapore Dollar",THB:"Thai Baht",TRY:"Turkish Lira",USD:"US Dollar",ZAR:"South African Rand"};
const modal = document.querySelector("#modal-currency");
const currencyInputs = document.querySelectorAll(".select-currency");
const countrySelectorButtons = document.querySelectorAll(".btn-flag");
const submitBtn = document.querySelector(".submit");
const amountField = document.querySelector("#amount-field");
const loadingSpinner = document.querySelector("#loader");
const $loader = $("#loader").hide();
const $convertedCurrencies = $("#converted-currencies").hide();
const conversationForm = document.querySelector("#conversation-area");
const width = window.innerWidth;
const height = window.innerHeight;
let currencySelectorDiv;

addEventListeners();

function addEventListeners() {
    for (let currInp of currencyInputs) {
        currInp.addEventListener("click", function(e) {
            modal.style.display = "block";
            if (e.target.nodeName === "SPAN" || e.target.nodeName === "IMG") {
                const target = e.target.parentElement.id;
                currencySelectorDiv = document.querySelector(`#${target}`);
            } else {
                currencySelectorDiv = document.querySelector(`#${e.target.id}`);
            }
        })
    }
    
    for (let button of countrySelectorButtons) {
        button.addEventListener("click", function(e) {
            currencySelectorDiv.innerHTML = "";
            const countryImg = document.createElement("img");
            countryImg.src = `img/${button.value}.png`;
            const countrySpan = document.createElement("span");
            countrySpan.innerHTML = button.value;
            currencySelectorDiv.appendChild(countryImg);
            currencySelectorDiv.appendChild(countrySpan);   
            modal.style.display = "none";   
        })
    }

    window.addEventListener("click", function(e) {
        e.stopPropagation();
        if (e.target == modal) {
            modal.style.display = "none";
        }
    })

    submitBtn.addEventListener("click", function() {
        currencyFrom = document.querySelector("#from-currency").lastElementChild.innerHTML;
        currencyTo = document.querySelector("#to-currency").lastElementChild.innerHTML;
        amount = amountField.value;
        console.log(convertCurrencies(currencyFrom, currencyTo));
    })
    
    amountField.addEventListener("keydown", function(e) {
        if(e == 13) {
            submitBtn.click();
            if(width < 750 && height < 1100){
                this.blur();
            }       
        }
    });

    conversationForm.addEventListener("submit", function(e) {
        e.preventDefault();
    })

}

const apiKey = "a694099b50dc0fd635ef";
const url = `https://free.currconv.com/api/v7/convert`;
let resp;

function convertCurrencies(currencyFrom, currencyTo) {
    $loader.show();
    queryValue = `${currencyFrom}_${currencyTo},${currencyTo}_${currencyFrom}`;
    $.ajax({
        url: url,
        type:"GET",
        data: {
            q: queryValue,
            compact: "ultra",
            apiKey: apiKey
        },
        success: function(result){
            $loader.hide();
            showResults(result, currencyFrom, currencyTo);
        },
        error:function(error){
            console.log(error);
            handleError();
            $loader.hide();
        }
    })
}

function showResults(result, from, to){
    $convertedCurrencies.show();
    $convertedCurrencies.innerHTML = "";
    
    let fromTo = result[(from + "_" + to)];
    let toFrom = result[(to + "_" + from)];
    let fromName = currencies[from];
    let toName = currencies[to];
    let amount = amountField.value;
    if (!amount) {
        amount = 1;
        amountField.value = 1;
    };

    let resultHTML = `<span class="sm-currency-from">${amount} ${fromName} =</span>
    <span class="lg-currency-to">${fromTo * amount}</span>
    <span class="currency-to-name">${toName}</span>
    <span class="one-from">1 ${from} = ${fromTo} ${to}</span>
    <span class="one-to">1 ${to} = ${toFrom} ${from}</span>`;

    const resultDiv = document.querySelector("#converted-currencies");
    resultDiv.innerHTML = resultHTML;
}

function handleError() {
    $convertedCurrencies.show();
    $convertedCurrencies.innerHTML = "";
    const resultDiv = document.querySelector("#converted-currencies");
    let resultHTML = `<span> Sorry, try again later. </span>`
    resultDiv.innerHTML = resultHTML;
}