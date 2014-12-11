cross-datepicker
================

Cross-DatePicker es un plugin para jQuery que permite generar campos para obtener una fecha de manera sencilla y cross-browser.

## Uso simple
```
$(function() {
    $("input[type='date']").cdp();
});
```

## Uso (con las opciones default)

```
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
```

* **addNullOption** *(No testeado)* : agrega un campo vacío dentro de cada *select*.
* **classes**: clases que se incluirán en los elementos.
* **format**: formato en el que se va a mostrar la fecha.
* **hideInput**: indica si debe ocultar el elemento que cross-datepicker reemplaza.
* **inputFormat**: formato en el que la fecha se traducirá dentro del input reemplazado.
* **months**: texto de los meses. Con esto se pueden realizar traducciones a otros idiomas.
* **nullOptionText**: texto para el campo vacío (en caso de que la opción **addNullOption** esté activada).
* **years**: rango de años. Puede ser de tres formas:
  + [1900, 2014] mostrará desde el año 1900 hasta el 2014
  + ["now", -100] mostrará desde el año actual hasta el año actual -100. Si el año actual es 2014 mostrará desde 1914  hasta el 2014.
  + ["now", -10, -100] mostrará desde el año actual -10 hasta el año actual -110. Si el año actual es 2014, mostrará entonces desde el 1904 hasta el 2004.

## Ejemplos

Ver archivos en carpeta "examples".

## Créditos
Creado por @lcnvdl. http://www.lucianorasente.com

## Extra

README redactado utilizando http://dillinger.io/. Muchas gracias.
