cross-datepicker
================

Cross-DatePicker es un plugin para jQuery que permite generar campos para obtener una fecha de manera sencilla y cross-browser.

## Uso (con las opciones default)

$(function() {

    $("input[type='date']").cdp({
    
        addNullOption: false,
        classes: {
            container: "cdp-container",
            controls: "cdp-select",
            days: "cdp-d",
            months: "cdp-m",
            years: "cdp-y"
        },
        format: "d/mmm/yyyy",
        hideInput: true,
        inputFormat: "yyyy-mm-dd",
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        nullOptionText: "Select",
        years: ["now", -100]
        
    });
    
});

* addNullOption: *No testeado* agrega un campo vacío dentro de cada /select/.
* format: formato en el que se va a mostrar la fecha.
* hideInput: indica si debe ocultar el elemento que cross-datepicker reemplaza.
* inputFormat: formato en el que la fecha se traducirá dentro del input reemplazado.
* years: 

## Ejemplos

