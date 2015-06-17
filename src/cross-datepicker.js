/**
 *
 *  Cross-DatePicker
 *  Version 0.3
 *
 *  @lcnvdl
 *  http://www.lucianorasente.com
 *  https://github.com/lcnvdl/cross-datepicker
 *
 */
 
 (function () {
 
    var sign = function(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };
    
    //  TODO Calcular año bisiesto
    var bisiesto = function(year)
    {
        return true;
    //    return (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 1 : 0;
    };
 
    $.fn.insertAt = $.fn.insertAt || function(index, $parent) {
        return this.each(function() {
            if (index === 0) {
                $parent.prepend(this);
            } else {
                $parent.children().eq(index - 1).after(this);
            }
        });
    };
 
    var Crossdp = function(e, o) {
        if (e.data("cross-datepicker")) {
            return this;
        }
        
        e.attr("type", "text");
        
        o = $.extend({}, $.fn.cdp.defaults, o);
        
        if(o.hideInput)
            e.hide();
            
        var cnt = $("<div>").addClass(o.classes.container || "").data("input", e).insertBefore(e);
        
        //  Data
        var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        //  Read format        
        var d = $("<select>").addClass(o.classes.controls || "").addClass(o.classes.days || ""),
            m = $("<select>").addClass(o.classes.controls || "").addClass(o.classes.months || ""),
            y = $("<select>").addClass(o.classes.controls || "").addClass(o.classes.year || "");
        
        /**
         *  Gets the format metadata.
         */
        var getFormat = function(format) {
        
            var f = {},
                last = "",
                order = 0,
                elements = {
                    "d": d,
                    "m": m,
                    "y": y
                };
                
            for(var i = 0, of=format; i < of.length; i++) {
            
                var c = of[i];
                
                if(last == c) {
                    f[c].count ++;
                }
                else if(c == "d" || c == "y" || c == "m") {
                    
                    f[c] = {
                        "count": 1,
                        "order": order++,
                        "e": elements[c]
                    };
                    
                    elements[c].data("order", f[c].order);
                    
                    last = c;
                }
                
                if(order > 3) {
                    throw "Invalid date format";
                }
            }
            
            return f;
        };
        
        var iF = getFormat(o.inputFormat),
            f = getFormat(o.format);
        
        for(var i in f) {
            
            f[i].e.appendTo(cnt);
        }
        
        cnt.sort(function(a, b) {
            if(a.data("order") > b.data("order")) {
                return 1;
            }
            else if(a.data("order") < b.data("order")) {
                return -1;
            }
            else {
                return 0;
            }
        });
        
        //  Helpers
        
        /**
         *  Format a numeric day to string.
         */
        var formatDay = function(day, format) {
            var text = String(day),
                c = format || f.d.count;
            
            while(c > text.length) {
                text = "0" + text;
            }
            
            return text;
        };
        
        /**
         *  Format a numeric month to string.
         */
        var formatMonth = function(month, format) {
            
            if(month > 12) {
                throw "Invalid month: "+month;
            }
            
            var c = format || f.m.count,
                text = String(month);
                
            if(c == 2) {
                if(text.length == 1) {
                    text = "0" + text;
                }
            }
            else if(c == 3) {
                text = o.months[i-1].substr(0, 3);
            }
            else if(c == 4) {
                text = o.months[i-1];
            }
            else {
                throw "Invalid month format";
            }
            
            return text;
        };
        
        /**
         *  Format a numeric month to string.
         */ 
        var formatYear = function(year, format) {
            var text = String(year),
                c = format || f.y.count;
            
            if(c == 2) {
                text = text.substr(text.length-2, 2);
            }
            else if(c != 4) {
                throw "Invalid year format";
            }
            
            return text;
        };
        
        var parseYear = function(date, format) {
            //  TODO
        };
        
        //  Update input function
        
        var formatDate = function(resultFormat, readFormat, years, months, days) {
            var a = ["d", "m", "y"],
                result = resultFormat;
                
            if(typeof days === 'string') 
                days = parseInt(days);
                
            if(typeof months === 'string') 
                months = parseInt(months);
                
            if(typeof years === 'string') 
                years = parseInt(years);
            
            for(var i = 0; i < a.length; i++) {
                    
                var ch = a[i],                      /*  Example: a[0]='d'      */
                    format = readFormat[ch],        /*  Example: uF['d']='dd'     */
                    word = "",
                    formatted = "";
                
                for(var j = 0; j < format.count; j++) {
                    word += ch;
                }
                
                if(ch == "d") {
                    formatted = formatDay(days, format.count);
                }
                else if(ch == "m") {
                    formatted = formatMonth(months, format.count);
                }
                else {
                    formatted = formatYear(years, format.count);
                }
                
                result = result.replace(word, formatted);                
            }
            
            return result;
        };
        
        var updateInput = function() {        
            e.val(formatDate(o.inputFormat, iF, y.val(), m.val(), d.val()));            
        };
        
        this.updateInput = function() {
            updateInput();
        };
        
        var updateFromInput = function() {        
            //  TODO
            
        };
        
        //  Generate 3 selects
        
        /*  Days    */
        
        d.data("days", 0);
        
        /**
         *  Days of determinated month.
         */
        var generateDays = function(month) {
            
            if(d.data("days") == days[month-1]) {
                return;
            }
            
            var selected = parseInt(d.val() || "1");
            
            d.html("");
            
            if(month == 0) {
                return;
            }
            
            if(o.addNullOption) {
                d.append("<option value=''>"+o.nullOptionText+"</option>");
            }
            
            for(var i = 1; i <= days[month-1]; i++) {
                $("<option>").attr("value", i).text(formatDay(i)).appendTo(d);
            }
            
            d.val(selected);
            
        };
        
        d.change(function() {
            updateInput();
        });
        
        generateDays(1);
        
        /*  Months  */
        
        m.change(function() {
        
            //  Regenerate days
            generateDays(parseInt($(this).val()));
            updateInput();
            
        });
            
        if(o.addNullOption) {
            m.append("<option value='0'>"+o.nullOptionText+"</option>");
        }
        
        for(var i = 1; i <= 12; i++) {
            m.append("<option value='"+i+"'>"+formatMonth(i)+"</option>");
        }
        
        /*  Years   */
        
        var from,
            to;
        
        if(typeof o.years[0] == 'string') {
            
            var current = new Date().getFullYear(),
                count;
        
            if(o.years.length == 3) {
                current += o.years[1];
                count = o.years[2];
            }
            else {
                count = o.years[1];
            }
            
            for(var i = current; i != current + count; i += sign(count)) {
                y.append("<option value='"+i+"'>"+formatYear(i)+"</option>");
            }
        }
        else {
                
            for(var i = o.years[0]; i != o.years[1]; i += sign(o.years[1]-o.years[0])) {
                y.append("<option value='"+i+"'>"+formatYear(i)+"</option>");
            }
            
        }
        
        y.change(function() {
            updateInput();
        });
        
        //  Save
        this.inputs = {
            d: d,
            y: y,
            m: m
        };
        
        //  Finish
        
        if(e.data("initial-day")) {
            $(function() {
                $.fn.cdp.statics.fns.set(e, [
                    e.data("initial-year"), 
                    e.data("initial-month"), 
                    e.data("initial-day")]);
            });
        }
        
        updateInput();

        e.data("cross-datepicker", this);
    };
 
    $.fn.cdp = function (o, arg) {

        var e = $(this);

        if (e.length == 0) {
            return this;
        }
        else if (e.length > 1) {
            e.each(function () {
                $(this).cdp(o);
            });

            return this;
        }
        
        if(!e.is("input")) {
            throw "You can apply Cross-DatePicker only on an 'input' element";
        }

        if(typeof o === 'string') {
            
            var st = $.fn.cdp.statics;
            if(!st.fns[o]) {
                console.error("Unknown function "+o);
            }

            st.fns[o](e, arg);
            
            return this;
        }
        
        var cdp = new Crossdp(e, o);
        
        return this;
    }
    
    $.fn.cdp.defaults = {
        hideInput: true,
        format: "d/mmm/yyyy",
        inputFormat: "yyyy-mm-dd",
        years: ["now", -100],    //  [initial year, final year] or ["now", relative years count] or ["now", relative years from, relative years count]
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        addNullOption: false,
        nullOptionText: "Select",
        classes: {
            container: "cdp-container",
            controls: "cdp-select",
            days: "cdp-d",
            months: "cdp-m",
            years: "cdp-y"
        }
    };
    
    $.fn.cdp.statics = {
        fns: {
            set: function(e, arg) {
            
                var st = $.fn.cdp.statics,
                    obj = e.data("cross-datepicker"),
                    y,m,d;
                
                if($.isArray(arg)) {
                    y = arg[0];
                    m = arg[1];
                    d = arg[2];
                }
                else if(typeof arg === 'string') {
                    var array = arg.split("-");
                    y = parseInt(arg[0]);
                    m = parseInt(arg[1]);
                    d = parseInt(arg[2]);
                }
                else {
                    y = arg.year || arg.y;
                    m = arg.month || arg.m;
                    d = arg.day || arg.d;
                }
                
                obj.inputs.y.val(String(y));
                obj.inputs.m.val(String(m));
                obj.inputs.d.val(String(d));
                
                obj.updateInput();                
            }
        }
    };
})();