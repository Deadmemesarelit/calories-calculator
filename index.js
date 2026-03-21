const submitBtn = document.querySelector('#bmr-form');
const ft = document.querySelector('.feet');
const inch = document.querySelector('.inches');
const weight = document.querySelector('.pounds');
const age = document.querySelector('.age-input');
const activityLevel = document.querySelector('.activity');
const errorMain = document.querySelector('.errors');
const resultant = document.querySelector('.results');
const transitioning = document.querySelector('.transitioning');
const isTransitioningDisplay = document.querySelector('.transitioning-months');
const monthsOnHRT = document.querySelector('.months-on-hrt')
submitBtn.addEventListener('click', () =>{
    const parseFt = parseInt(ft.value);
    const parseInch = parseInt(inch.value);
    const parseWeight = parseInt(weight.value);
    const parseAge = parseInt(age.value);
    const parseActivityLevel = parseFloat(activityLevel.value);
    const parseIsTransitioning = transitioning.value;
    const sex = document.querySelector('input[name="sex"]:checked').value;
    errorMain.innerHTML = '';
    let errors = [];
    

    if (!parseFt || (parseFt < 3 || parseFt > 8)){
        errors.push('Please enter a reasonable amount of feet.');
    }

    if (isNaN(parseInch) || (parseInch < 0 || parseInch > 11)){
        errors.push('Please enter a reasonable amount of inches.');
    }

    if (!parseAge || (parseAge < 15 || parseAge > 100)){
        errors.push('Please enter a reasonable age.');
    }

    if (!parseWeight || (parseWeight < 50 || parseWeight > 500)){
        errors.push('Please enter a reasonable weight.');
    }

    if (errors.length > 0 ){
        errorMain.innerHTML = errors.map(err => `<p class="error">Error: ${err}</p>`).join('');
        errorMain.id = "";
        return;
    }
    errorMain.id = "no-display";
    const cms = ftToCm(parseFt, parseInch);
    const kgs = lbsToKg(parseWeight);

    const TDEE = calculateBMR(kgs, cms, parseAge, sex, parseIsTransitioning) * parseActivityLevel;
    const loseHalfLb = TDEE - 250;   
    const loseOneLb = TDEE - 500;    
    const maintainWeight = TDEE;
    const gainHalfLb = TDEE + 250;

    resultant.id = "";
    resultant.innerHTML = `<h1>Results:</h1>
    <span> To lose one Pound: ${Math.round(loseOneLb)} calories </span>
    <span>To lose half a pound: ${Math.round(loseHalfLb)} calories </span>
    <span> To  maintain weight: ${Math.round(maintainWeight)} calories </span>
    <span> To  gain half a pound: ${Math.round(gainHalfLb)} calories </span>`;
    

});


transitioning.addEventListener('change', (e) =>{
    const value = e.target.value;
    
    // Show the input if MTF or FTM is selected, otherwise hide it
    if (value === 'male-to-female' || value === 'female-to-male') {
        isTransitioningDisplay.style.display = 'block';
    } else {
        isTransitioningDisplay.style.display = 'none';
        // Good practice: Clear the input if they go back to "No"
        monthsOnHRT.value = '';
    }
})

function ftToCm(ft, inch){
    return (ft *12 + inch )* 2.54
}

function lbsToKg(lbs) {
    return lbs / 2.20462;                   
}


function calculateBMR(weightKg, heightCm, age, sex, isTransitioning) {
    let finalBMR;
    let bias;
    const parsedMonthsOnHRT = parseInt(monthsOnHRT.value) || 0;
    console.log(isTransitioning);
    const maleBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    const femaleBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

    switch(isTransitioning){
        case 'male-to-female': 
            bias = Math.min(parsedMonthsOnHRT / 24, 1);
            finalBMR = (maleBMR * (1 - bias)) + (femaleBMR * bias);
            break;
        case 'female-to-male':
            bias = Math.min(parsedMonthsOnHRT / 12, 1);
            finalBMR = (femaleBMR * (1 - bias)) + (maleBMR * bias);
            break;
        case 'No': 
            finalBMR = (sex === 'male') ? maleBMR : femaleBMR;
            break;
        default: 
            finalBMR = (sex === 'male') ? maleBMR : femaleBMR;  
    }
    return finalBMR;
    // switch (sex){
    //     case 'male':
    //         bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    //         if (isTransitioning === 'MTF'){
    //             let bias = 
    //         }
    //         return bmr;
    //     case 'female':
    //         return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    //     default:
    //         throw new Error(`Unknown Sex: ${sex}`);
    // }

}


