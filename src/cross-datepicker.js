/**
 *
 *  Cross-DatePicker
 *  Version 0.1
 *
 *  @lcnvdl
 *  http://www.lucianorasente.com
 *
 */
 
 (function () {
 
    var sign = function(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
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
 
    $.fn.cdp = function (o) {
    
        o = $.extend({}, $.fn.cdp.defaults, o);

        var e = $(this);

        if (e.length == 0) {
            return this;
        }
        else if (e.length > 1) {
            e.each(function () {
                $(this).crossdp();
            });

            return this;
        }

        if (e.data("cross-datepicker")) {
            return this;
        }
        
        if(!e.is("input")) {
            throw "You can apply Cross-DatePicker only on an 'input' element";
        }
        
        if(o.hideInput)
            e.hide();
            
        var cnt = $("<div>").addClass(o.classes.container).data("input", e).insertBefore(e);
        
        //  Data
        var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        //  Read format        
        var d = $("<select>").addClass(o.classes.controls).addClass(o.classes.days),
            m = $("<select>").addClass(o.classes.controls).addClass(o.classes.months),
            y = $("<select>").addClass(o.classes.controls).addClass(o.classes.year);
        
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
        
        var formatDay = function(day, format) {
            var text = String(day),
                c = format || f.d.count;
            
            while(c > text.length) {
                text = "0" + text;
            }
            
            return text;
        };
            
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
        
        //  Update input function
        
        var updateInput = function() {
            
            var a = ["d", "m", "y"],
                result = o.inputFormat;
            
            for(var i = 0; i < a.length; i++) {
                
                var ch = a[i],
                    format = iF[ch],
                    word = "",
                    formatted = "";
                
                for(var j = 0; j < format.count; j++) {
                    word += ch;
                }
                
                if(ch == "d") {
                    formatted = formatDay(parseInt(d.val()), format.count);
                }
                else if(ch == "m") {
                    formatted = formatMonth(parseInt(m.val()), format.count);
                }
                else {
                    formatted = formatYear(parseInt(y.val()), format.count);
                }
                
                result = result.replace(word, formatted);                
            }
            
            e.val(result);
            
        };
        
        //  Generate 3 selects
        
        /*  Days    */
        
        d.data("days", 0);
        
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
        
        //  Finish
        
        updateInput();

        e.data("cross-datepicker", true);
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
    
    
})();