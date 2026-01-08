/*To convert the temperature between Celsius, Fahrenheit, and Kelvin, the following steps can be taken:
    A prompt can be added inside the question asking for the conversion.
    After the user selects the temperature, the temperature reading they want to convert can be stored in a variable asa number.
    Then, another question can ask what unit the user would like the temperature to be converted into.
    The output can be saved as a variable.
    A switch statement or an if statement can be used to convert the numbers.
    The output will display the first variable, then the temperature, and finally the converted temperature.
   */

    //To get input from the user.
let convertTemp = prompt(`In which metric is the temperature you are converting?
C - Celsius
F - Fahrenheit
K - Kelvin `).toUpperCase();
    if (convertTemp !== 'C' && convertTemp !== 'F' && convertTemp !== 'K'){  // If the user didn't give a valid answer. 
        alert('Please use the input value as C, F or K. ');
        convertTemp = prompt(`In which metric is the temperature you are converting?  
            C - Celsius
            F - Fahrenheit
            K - Kelvin `).toUpperCase(); // I had a problem to go back to the question after the alert run, so i put the question in again.  
                                        // I did some investigation to find out how to do it, but I ran into loop statements, and I know I can't run loops inside this code. 
    }
//Provide the temperature that he what to convert as a number.
let tempAmount = Number(prompt(`What is the temperature you what to convert? `)); // If the user didn't give a number.
    if (isNaN(tempAmount)) {
        alert(`Please input the temperature value to convert. `); 
        tempAmount = Number(prompt(`What is the temperature you what to convert? `));}

// To get feedback from the user to say in what temperature he would like to convert into.
let convertTempTo = prompt(`To which metric would you like to convert the temperature?
C - Celsius
F - Fahrenheit
K - Kelvin `).toUpperCase();
    if (convertTemp !== 'C' && convertTemp !== 'F' && convertTemp !== 'K'){ // If the user didn't give a valid answer. 
        alert('Please use the input value as C, F or K. ');
        convertTempTo = prompt(`To which metric would you like to convert the temperature?
            C - Celsius
            F - Fahrenheit
            K - Kelvin `).toUpperCase();}

// The switch statement is to check the user's first temperature (convertTemp).
switch (convertTemp) {
    case "C" : 
        if (convertTempTo === "F"){ // An if statement is used to check the temperature unit the user wants to convert into.
            newTemp = ((tempAmount* (9/5))+32).toFixed(2)
            alert(`${tempAmount} \u00B0C is ${newTemp} \u00B0F`)
        }else if (convertTempTo === "K"){    
            newTemp = (tempAmount + 273.15).toFixed(2)
            alert(`${tempAmount} \u00B0C is ${newTemp} K`)}
        else{   // If the user inputs the same temperature in both questions, an alert will appear.
            alert(`You have selected the same temperature unit for conversion.\nThe input value and the converted value will remain ${tempAmount} \u00B0C`)
        }
        break;
    case "F" : 
        if (convertTempTo === "C"){
            newTemp = ((tempAmount - 32)*(5/9)).toFixed(2)
            alert(`${tempAmount} \u00B0F is ${newTemp} \u00B0C`)
        }else if (convertTempTo === "K"){    
            newTemp = ((tempAmount + 459.67)*(5/9)).toFixed(2)
            alert(`${tempAmount} \u00B0F is ${newTemp} K`)}
            else{
                alert(`You have selected the same temperature unit for conversion.\nThe input value and the converted value will remain ${tempAmount} \u00B0F`)
            }
        break;
    case "K" : 
        if (convertTempTo === "C"){
            newTemp = (tempAmount - 273.15).toFixed(2)
            alert(`${tempAmount} K is ${newTemp} \u00B0C`)
        }else if (convertTempTo === "F"){    
            newTemp = ((tempAmount * (9/5)) - 459.67).toFixed(2)
            alert(`${tempAmount} K is ${newTemp} \u00B0F`)}
            else{
                alert(`You have selected the same temperature unit for conversion.\nThe input value and the converted value will remain ${tempAmount} K`)
            }
        break;
    default: // If something went wrong on the user's side this message will appear
        alert(`Please provide the data to convert the temperature. `);
        break;
}

/* --- Where did i found information from ---
    1. Girl Develop it Chicago
        I got the code for the degree symbol.  
        http://gdichicago.com/courses/gdi-featured-js-intro/homework.html#:~:text=Unicode%20Characters%3A%20To%20print%20the,C%20is%20NN%C2%B0F%22.
    2. CalculatorSoup
        I check my answer on this page for the temperature conversion 
        https://www.calculatorsoup.com/calculators/conversions/temperature.php
    3. ChatGPT
        To check my code and spelling
        https://chatgpt.com/*/