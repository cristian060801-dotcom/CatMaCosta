/* =========================================================
   CÂTMĂCOSTĂ.RO
   TOATE CALCULATOARELE
========================================================= */


/* =========================================================
   FUNCȚIE GENERALĂ
========================================================= */

function openCalculator(type) {

    closeCalculator();

    switch (type) {

        case "salary":
            openSalaryCalculator();
            break;

        case "loan":
            openLoanCalculator();
            break;

        case "fuel":
            openFuelCalculator();
            break;

        case "car":
            openCarCalculator();
            break;

        case "tax":
            openTaxCalculator();
            break;

        case "hourly":
            openHourlyCalculator();
            break;

        case "expenses":
            openExpensesCalculator();
            break;

        default:
            showComingSoon();

    }

}


/* =========================================================
   UTILITĂȚI
========================================================= */

function formatMoney(value) {

    return new Intl.NumberFormat("ro-RO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

}


function createModal(content) {

    const modal = document.createElement("div");

    modal.id = "calculator-modal";

    modal.innerHTML = `
        <div class="calculator-overlay"
             onclick="closeCalculator(event)">

            <div class="calculator-modal-box"
                 onclick="event.stopPropagation()">

                <button
                    class="close-calculator"
                    onclick="closeCalculator()">
                    ×
                </button>

                ${content}

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document.body.style.overflow = "hidden";

}


function closeCalculator(event) {

    if (
        event &&
        event.target &&
        !event.target.classList.contains("calculator-overlay")
    ) {
        return;
    }

    const modal =
        document.getElementById("calculator-modal");

    if (modal) {
        modal.remove();
    }

    document.body.style.overflow = "";

}


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeCalculator();
    }

});


/* =========================================================
   1. SALARIU BRUT → NET
   ROMÂNIA — IULIE–DECEMBRIE 2026
========================================================= */

function openSalaryCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                💰
            </div>

            <div>

                <p class="modal-label">
                    CALCULATOR SALARIU
                </p>

                <h2>
                    Salariu brut → net
                </h2>

                <p>
                    Află cât primești efectiv în mână.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Salariul brut
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="salary-gross"
                    placeholder="Ex: 5000"
                    min="0"
                    oninput="calculateSalary()">

                <span>lei</span>

            </div>


            <label>
                Persoane în întreținere
            </label>

            <select
                id="salary-dependents"
                onchange="calculateSalary()">

                <option value="0">
                    0 persoane
                </option>

                <option value="1">
                    1 persoană
                </option>

                <option value="2">
                    2 persoane
                </option>

                <option value="3">
                    3 persoane
                </option>

                <option value="4">
                    4+ persoane
                </option>

            </select>


            <label class="checkbox-label">

                <input
                    type="checkbox"
                    id="salary-under-26"
                    onchange="calculateSalary()">

                <span>
                    Am până la 26 de ani
                </span>

            </label>


            <label>
                Copii sub 18 ani înscriși la o unitate de învățământ
            </label>

            <select
                id="salary-school-children"
                onchange="calculateSalary()">

                <option value="0">
                    0 copii
                </option>

                <option value="1">
                    1 copil
                </option>

                <option value="2">
                    2 copii
                </option>

                <option value="3">
                    3 copii
                </option>

                <option value="4">
                    4+ copii
                </option>

            </select>


            <label class="checkbox-label">

                <input
                    type="checkbox"
                    id="salary-benefit"
                    checked
                    onchange="calculateSalary()">

                <span>
                    Salariul de bază este 4.325 lei și
                    îndeplinesc condițiile pentru facilitatea
                    de 200 lei neimpozabili
                </span>

            </label>


            <p class="calculator-note">
                Estimare pentru România, perioada
                iulie–decembrie 2026. Rezultatul poate
                varia în funcție de situația fiscală.
            </p>

        </div>


        <div id="salary-result"
             class="salary-result">

            <div class="result-main">

                <span>
                    Salariu net estimat
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);


    setTimeout(() => {

        const input =
            document.getElementById("salary-gross");

        if (input) {
            input.focus();
        }

    }, 100);

}


/* =========================================================
   DEDUCERE PERSONALĂ
========================================================= */

function calculatePersonalDeduction(
    gross,
    dependents
) {

    const minimumSalary = 4325;


    if (gross <= 0) {
        return 0;
    }


    /*
       Deducerea personală de bază se acordă
       pentru venituri brute până la salariul minim
       + 2.000 lei.
    */

    if (gross > minimumSalary + 2000) {
        return 0;
    }


    let bracket = 0;


    if (gross > minimumSalary) {

        bracket =
            Math.floor(
                (gross - minimumSalary) / 50
            );

        bracket =
            Math.min(40, bracket);

    }


    /*
       La salariul minim:

       0 persoane = 20%
       1 persoană  = 25%
       2 persoane  = 30%
       3 persoane  = 35%
       4+ persoane = 45%

       Pentru fiecare tranșă de 50 lei,
       procentul de bază scade cu 0,5 puncte.
    */

    const basePercent =
        20 - (bracket * 0.5);


    let dependentBonus;


    if (dependents >= 4) {

        dependentBonus = 25;

    } else {

        dependentBonus =
            dependents * 5;

    }


    const totalPercent =
        basePercent + dependentBonus;


    return (
        minimumSalary *
        totalPercent /
        100
    );

}


/* =========================================================
   CALCUL SALARIU
========================================================= */

function calculateSalary() {

    const grossInput =
        document.getElementById("salary-gross");

    const dependentsInput =
        document.getElementById("salary-dependents");

    const under26Input =
        document.getElementById("salary-under-26");

    const childrenInput =
        document.getElementById("salary-school-children");

    const benefitInput =
        document.getElementById("salary-benefit");

    const result =
        document.getElementById("salary-result");


    if (
        !grossInput ||
        !dependentsInput ||
        !under26Input ||
        !childrenInput ||
        !benefitInput ||
        !result
    ) {
        return;
    }


    const gross =
        Number(grossInput.value);


    const dependents =
        Number(dependentsInput.value);


    const under26 =
        under26Input.checked;


    const children =
        Number(childrenInput.value);


    const benefitRequested =
        benefitInput.checked;


    if (!gross || gross <= 0) {

        result.innerHTML = `

            <div class="result-main">

                <span>
                    Salariu net estimat
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        `;

        return;
    }


    const minimumSalary = 4325;


    /* =====================================================
       FACILITATEA DE 200 LEI
    ===================================================== */

    let nonTaxable = 0;


    /*
       Pentru iulie–decembrie 2026,
       cei 200 lei pot fi exceptați de la
       contribuții și impozit dacă sunt
       îndeplinite condițiile legale.
    */


    if (
        benefitRequested &&
        gross >= minimumSalary &&
        gross <= 4600
    ) {

        nonTaxable = 200;

    }


    /* =====================================================
       BAZA PENTRU CONTRIBUȚII
    ===================================================== */

    const contributionBase =
        Math.max(
            0,
            gross - nonTaxable
        );


    /* =====================================================
       CAS
    ===================================================== */

    const cas =
        contributionBase * 0.25;


    /* =====================================================
       CASS
    ===================================================== */

    const cass =
        contributionBase * 0.10;


    /* =====================================================
       VENIT DUPĂ CONTRIBUȚII
    ===================================================== */

    const netBeforeTax =
        contributionBase -
        cas -
        cass;


    /* =====================================================
       DEDUCERE PERSONALĂ
    ===================================================== */

    const personalDeduction =
        calculatePersonalDeduction(
            gross,
            dependents
        );


    /* =====================================================
       DEDUCERE SUPLIMENTARĂ ≤ 26 ANI
    ===================================================== */

    const additionalUnder26 =
        under26
            ? minimumSalary * 0.15
            : 0;


    /* =====================================================
       DEDUCERE COPII
    ===================================================== */

    const additionalChildren =
        children * 100;


    /* =====================================================
       BAZĂ IMPOZABILĂ
    ===================================================== */

    const taxable =
        Math.max(
            0,
            netBeforeTax -
            personalDeduction -
            additionalUnder26 -
            additionalChildren
        );


    /* =====================================================
       IMPOZIT PE VENIT
    ===================================================== */

    const incomeTax =
        taxable * 0.10;


    /* =====================================================
       SALARIU NET
    ===================================================== */

    const net =
        gross -
        cas -
        cass -
        incomeTax;


    /* =====================================================
       AFIȘARE
    ===================================================== */

    result.innerHTML = `

        <div class="result-main">

            <span>
                Salariu net estimat
            </span>

            <strong>
                ${formatMoney(net)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    CAS 25%
                </span>

                <strong>
                    ${formatMoney(cas)} lei
                </strong>

            </div>


            <div>

                <span>
                    CASS 10%
                </span>

                <strong>
                    ${formatMoney(cass)} lei
                </strong>

            </div>


            <div>

                <span>
                    Impozit pe venit 10%
                </span>

                <strong>
                    ${formatMoney(incomeTax)} lei
                </strong>

            </div>


            <div>

                <span>
                    Deducere personală
                </span>

                <strong>
                    ${formatMoney(personalDeduction)} lei
                </strong>

            </div>


            ${
                additionalUnder26 > 0
                    ? `
                        <div>

                            <span>
                                Deducere suplimentară ≤26 ani
                            </span>

                            <strong>
                                ${formatMoney(additionalUnder26)} lei
                            </strong>

                        </div>
                      `
                    : ""
            }


            ${
                additionalChildren > 0
                    ? `
                        <div>

                            <span>
                                Deducere copii
                            </span>

                            <strong>
                                ${formatMoney(additionalChildren)} lei
                            </strong>

                        </div>
                      `
                    : ""
            }

        </div>


        ${
            nonTaxable > 0
                ? `
                    <div class="benefit-message">

                        ✓ Au fost aplicați 200 lei
                        neimpozabili și necuprinși în
                        baza contribuțiilor.

                    </div>
                  `
                : ""
        }

    `;

}


/* =========================================================
   2. CALCULATOR CREDIT
========================================================= */

function openLoanCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                💳
            </div>

            <div>

                <p class="modal-label">
                    CALCULATOR CREDIT
                </p>

                <h2>
                    Rata creditului
                </h2>

                <p>
                    Calculează rata și costul total.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Suma împrumutată
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="loan-amount"
                    placeholder="Ex: 50000"
                    min="0"
                    oninput="calculateLoan()">

                <span>lei</span>

            </div>


            <label>
                Perioada
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="loan-years"
                    placeholder="Ex: 5"
                    min="1"
                    oninput="calculateLoan()">

                <span>ani</span>

            </div>


            <label>
                Dobânda anuală
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="loan-interest"
                    placeholder="Ex: 8"
                    min="0"
                    step="0.01"
                    oninput="calculateLoan()">

                <span>%</span>

            </div>

        </div>


        <div id="loan-result"
             class="loan-result">

            <div class="result-main">

                <span>
                    Rată lunară
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);

}


function calculateLoan() {

    const amount =
        Number(
            document.getElementById("loan-amount").value
        );

    const years =
        Number(
            document.getElementById("loan-years").value
        );

    const annualInterest =
        Number(
            document.getElementById("loan-interest").value
        );


    const result =
        document.getElementById("loan-result");


    if (
        amount <= 0 ||
        years <= 0 ||
        annualInterest < 0
    ) {

        result.innerHTML = `

            <div class="result-main">

                <span>
                    Rată lunară
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        `;

        return;
    }


    const months =
        years * 12;


    const monthlyRate =
        annualInterest / 100 / 12;


    let monthlyPayment;


    if (monthlyRate === 0) {

        monthlyPayment =
            amount / months;

    } else {

        monthlyPayment =
            amount *
            (
                monthlyRate *
                Math.pow(
                    1 + monthlyRate,
                    months
                )
            ) /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );

    }


    const total =
        monthlyPayment * months;


    const interest =
        total - amount;


    result.innerHTML = `

        <div class="result-main">

            <span>
                Rată lunară estimată
            </span>

            <strong>
                ${formatMoney(monthlyPayment)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    Suma împrumutată
                </span>

                <strong>
                    ${formatMoney(amount)} lei
                </strong>

            </div>


            <div>

                <span>
                    Dobândă totală
                </span>

                <strong>
                    ${formatMoney(interest)} lei
                </strong>

            </div>


            <div>

                <span>
                    Total de plată
                </span>

                <strong>
                    ${formatMoney(total)} lei
                </strong>

            </div>

        </div>


        <div class="benefit-message">

            ℹ️ Calculul nu include comisioane,
            asigurări sau alte costuri ale băncii.

        </div>

    `;

}


/* =========================================================
   3. COST COMBUSTIBIL
========================================================= */

function openFuelCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                🚗
            </div>

            <div>

                <p class="modal-label">
                    COST COMBUSTIBIL
                </p>

                <h2>
                    Cât te costă drumul?
                </h2>

                <p>
                    Calculează costul unei călătorii.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Distanța
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="fuel-distance"
                    placeholder="Ex: 300"
                    min="0"
                    oninput="calculateFuel()">

                <span>km</span>

            </div>


            <label>
                Consum mediu
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="fuel-consumption"
                    placeholder="Ex: 6.5"
                    min="0"
                    step="0.1"
                    oninput="calculateFuel()">

                <span>L/100 km</span>

            </div>


            <label>
                Preț combustibil
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="fuel-price"
                    placeholder="Ex: 8"
                    min="0"
                    step="0.01"
                    oninput="calculateFuel()">

                <span>lei/L</span>

            </div>

        </div>


        <div id="fuel-result"
             class="fuel-result">

            <div class="result-main">

                <span>
                    Cost călătorie
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);

}


function calculateFuel() {

    const distance =
        Number(
            document.getElementById("fuel-distance").value
        );

    const consumption =
        Number(
            document.getElementById("fuel-consumption").value
        );

    const price =
        Number(
            document.getElementById("fuel-price").value
        );


    const result =
        document.getElementById("fuel-result");


    if (
        distance <= 0 ||
        consumption <= 0 ||
        price <= 0
    ) {

        result.innerHTML = `

            <div class="result-main">

                <span>
                    Cost călătorie
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        `;

        return;
    }


    const liters =
        distance *
        consumption /
        100;


    const totalCost =
        liters *
        price;


    const costPerKm =
        totalCost /
        distance;


    result.innerHTML = `

        <div class="result-main">

            <span>
                Cost călătorie
            </span>

            <strong>
                ${formatMoney(totalCost)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    Combustibil consumat
                </span>

                <strong>
                    ${formatMoney(liters)} L
                </strong>

            </div>


            <div>

                <span>
                    Cost pe kilometru
                </span>

                <strong>
                    ${formatMoney(costPerKm)} lei/km
                </strong>

            </div>

        </div>

    `;

}


/* =========================================================
   4. IMPORT MAȘINĂ
========================================================= */

function openCarCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                🚘
            </div>

            <div>

                <p class="modal-label">
                    IMPORT AUTO
                </p>

                <h2>
                    Cost import mașină
                </h2>

                <p>
                    Estimează costul total al mașinii.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Prețul mașinii
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="car-price"
                    placeholder="Ex: 5000"
                    min="0"
                    oninput="calculateCar()">

                <span>€</span>

            </div>


            <label>
                Transport
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="car-transport"
                    placeholder="Ex: 700"
                    min="0"
                    oninput="calculateCar()">

                <span>€</span>

            </div>


            <label>
                Numere / acte / drumuri
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="car-documents"
                    placeholder="Ex: 300"
                    min="0"
                    oninput="calculateCar()">

                <span>€</span>

            </div>


            <label>
                Alte costuri
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="car-other"
                    placeholder="Ex: 200"
                    min="0"
                    oninput="calculateCar()">

                <span>€</span>

            </div>

        </div>


        <div id="car-result"
             class="car-result">

            <div class="result-main">

                <span>
                    Cost total estimat
                </span>

                <strong>
                    0 €
                </strong>

            </div>

        </div>

    `);

}


function calculateCar() {

    const price =
        Number(
            document.getElementById("car-price").value
        ) || 0;

    const transport =
        Number(
            document.getElementById("car-transport").value
        ) || 0;

    const documents =
        Number(
            document.getElementById("car-documents").value
        ) || 0;

    const other =
        Number(
            document.getElementById("car-other").value
        ) || 0;


    const total =
        price +
        transport +
        documents +
        other;


    const result =
        document.getElementById("car-result");


    result.innerHTML = `

        <div class="result-main">

            <span>
                Cost total estimat
            </span>

            <strong>
                ${formatMoney(total)} €
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    Mașină
                </span>

                <strong>
                    ${formatMoney(price)} €
                </strong>

            </div>


            <div>

                <span>
                    Transport
                </span>

                <strong>
                    ${formatMoney(transport)} €
                </strong>

            </div>


            <div>

                <span>
                    Acte / numere
                </span>

                <strong>
                    ${formatMoney(documents)} €
                </strong>

            </div>


            <div>

                <span>
                    Alte costuri
                </span>

                <strong>
                    ${formatMoney(other)} €
                </strong>

            </div>

        </div>


        <div class="benefit-message">

            ℹ️ Estimarea nu include taxe specifice
            unei țări sau situații speciale.

        </div>

    `;

}


/* =========================================================
   5. CALCULATOR TAXE
========================================================= */

function openTaxCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                🧾
            </div>

            <div>

                <p class="modal-label">
                    CALCULATOR TAXE
                </p>

                <h2>
                    Taxe și contribuții
                </h2>

                <p>
                    Calculează principalele contribuții.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Venit brut
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="tax-income"
                    placeholder="Ex: 5000"
                    min="0"
                    oninput="calculateTax()">

                <span>lei</span>

            </div>

        </div>


        <div id="tax-result"
             class="tax-result">

            <div class="result-main">

                <span>
                    Venit după taxe
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);

}


function calculateTax() {

    const income =
        Number(
            document.getElementById("tax-income").value
        );


    const result =
        document.getElementById("tax-result");


    if (income <= 0) {

        result.innerHTML = `

            <div class="result-main">

                <span>
                    Venit după taxe
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        `;

        return;
    }


    const cas =
        income * 0.25;


    const cass =
        income * 0.10;


    const taxBase =
        Math.max(
            0,
            income -
            cas -
            cass
        );


    const incomeTax =
        taxBase * 0.10;


    const net =
        income -
        cas -
        cass -
        incomeTax;


    result.innerHTML = `

        <div class="result-main">

            <span>
                Venit după taxe
            </span>

            <strong>
                ${formatMoney(net)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    CAS 25%
                </span>

                <strong>
                    ${formatMoney(cas)} lei
                </strong>

            </div>


            <div>

                <span>
                    CASS 10%
                </span>

                <strong>
                    ${formatMoney(cass)} lei
                </strong>

            </div>


            <div>

                <span>
                    Impozit 10%
                </span>

                <strong>
                    ${formatMoney(incomeTax)} lei
                </strong>

            </div>

        </div>

    `;

}


/* =========================================================
   6. SALARIU PE ORĂ
========================================================= */

function openHourlyCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                ⏱️
            </div>

            <div>

                <p class="modal-label">
                    SALARIU PE ORĂ
                </p>

                <h2>
                    Cât valorează o oră?
                </h2>

                <p>
                    Calculează venitul pe oră și pe zi.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Salariul net lunar
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="hourly-salary"
                    placeholder="Ex: 3500"
                    min="0"
                    oninput="calculateHourly()">

                <span>lei</span>

            </div>


            <label>
                Ore lucrate pe săptămână
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="hourly-hours"
                    value="40"
                    min="1"
                    oninput="calculateHourly()">

                <span>ore</span>

            </div>

        </div>


        <div id="hourly-result"
             class="hourly-result">

            <div class="result-main">

                <span>
                    Câștig pe oră
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);

}


function calculateHourly() {

    const salary =
        Number(
            document.getElementById("hourly-salary").value
        );

    const weeklyHours =
        Number(
            document.getElementById("hourly-hours").value
        );


    const result =
        document.getElementById("hourly-result");


    if (
        salary <= 0 ||
        weeklyHours <= 0
    ) {

        result.innerHTML = `

            <div class="result-main">

                <span>
                    Câștig pe oră
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        `;

        return;
    }


    const monthlyHours =
        weeklyHours *
        52 /
        12;


    const hourly =
        salary /
        monthlyHours;


    const daily =
        hourly *
        8;


    result.innerHTML = `

        <div class="result-main">

            <span>
                Câștig pe oră
            </span>

            <strong>
                ${formatMoney(hourly)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    Câștig pe zi (8 ore)
                </span>

                <strong>
                    ${formatMoney(daily)} lei
                </strong>

            </div>


            <div>

                <span>
                    Ore lunare estimate
                </span>

                <strong>
                    ${formatMoney(monthlyHours)} ore
                </strong>

            </div>

        </div>

    `;

}


/* =========================================================
   7. CHELTUIELI LUNARE
========================================================= */

function openExpensesCalculator() {

    createModal(`

        <div class="calculator-modal-header">

            <div class="modal-icon">
                🏠
            </div>

            <div>

                <p class="modal-label">
                    CHELTUIELI LUNARE
                </p>

                <h2>
                    Bugetul tău lunar
                </h2>

                <p>
                    Vezi unde se duc banii tăi.
                </p>

            </div>

        </div>


        <div class="calculator-form">

            <label>
                Locuință / chirie
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-home"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>


            <label>
                Mâncare
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-food"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>


            <label>
                Transport
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-transport"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>


            <label>
                Facturi
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-bills"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>


            <label>
                Rate / credite
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-loans"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>


            <label>
                Alte cheltuieli
            </label>

            <div class="input-wrapper">

                <input
                    type="number"
                    id="expense-other"
                    placeholder="0"
                    min="0"
                    oninput="calculateExpenses()">

                <span>lei</span>

            </div>

        </div>


        <div id="expenses-result"
             class="expenses-result">

            <div class="result-main">

                <span>
                    Cheltuieli totale
                </span>

                <strong>
                    0 lei
                </strong>

            </div>

        </div>

    `);

}


function calculateExpenses() {

    const home =
        Number(
            document.getElementById("expense-home").value
        ) || 0;

    const food =
        Number(
            document.getElementById("expense-food").value
        ) || 0;

    const transport =
        Number(
            document.getElementById("expense-transport").value
        ) || 0;

    const bills =
        Number(
            document.getElementById("expense-bills").value
        ) || 0;

    const loans =
        Number(
            document.getElementById("expense-loans").value
        ) || 0;

    const other =
        Number(
            document.getElementById("expense-other").value
        ) || 0;


    const total =
        home +
        food +
        transport +
        bills +
        loans +
        other;


    const result =
        document.getElementById("expenses-result");


    result.innerHTML = `

        <div class="result-main">

            <span>
                Cheltuieli totale
            </span>

            <strong>
                ${formatMoney(total)} lei
            </strong>

        </div>


        <div class="result-details">

            <div>

                <span>
                    Locuință
                </span>

                <strong>
                    ${formatMoney(home)} lei
                </strong>

            </div>


            <div>

                <span>
                    Mâncare
                </span>

                <strong>
                    ${formatMoney(food)} lei
                </strong>

            </div>


            <div>

                <span>
                    Transport
                </span>

                <strong>
                    ${formatMoney(transport)} lei
                </strong>

            </div>


            <div>

                <span>
                    Facturi
                </span>

                <strong>
                    ${formatMoney(bills)} lei
                </strong>

            </div>


            <div>

                <span>
                    Rate / credite
                </span>

                <strong>
                    ${formatMoney(loans)} lei
                </strong>

            </div>


            <div>

                <span>
                    Alte cheltuieli
                </span>

                <strong>
                    ${formatMoney(other)} lei
                </strong>

            </div>

        </div>

    `;

}


/* =========================================================
   CALCULATOR ÎN LUCRU
========================================================= */

function showComingSoon() {

    createModal(`

        <div class="coming-soon-box">

            <div class="coming-icon">
                🚧
            </div>

            <h2>
                Calculator în lucru
            </h2>

            <p>
                Revenim în curând cu această funcție.
            </p>

            <button
                class="modal-action-button"
                onclick="closeCalculator()">

                Am înțeles

            </button>

        </div>

    `);

}