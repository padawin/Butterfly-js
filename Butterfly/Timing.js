/**
 * Butterfly/Timing.js file
 *
 */

Butterfly.Timing = {

    addTimeout : function(name, fct, time, param)
    {
        if (param) {
            Butterfly.Timing.timeouts[name] = setTimeout(fct, time, param);
            delete Butterfly.Timing.timeouts[name];
        }
        else {
            Butterfly.Timing.timeouts[name] = setTimeout(fct, time);
            delete Butterfly.Timing.timeouts[name];
        }
    },

    removeTimeout : function(name)
    {
        if (Butterfly.Timing.timeouts[name]) {
            clearTimeout(Butterfly.Timing.timeouts[name]);
            delete Butterfly.Timing.timeouts[name];
        }
    },

    timeoutExists : function(name)
    {
        return Butterfly.Timing.timeouts[name] != null ;
    },

    addInterval : function(name, fct, time, param)
    {
        if (param) {
            Butterfly.Timing.intervals[name] = setInterval(fct, time, param);
        }
        else {
            Butterfly.Timing.intervals[name] = setInterval(fct, time);
        }
    },

    removeInterval : function(name)
    {
        if (Butterfly.Timing.intervals[name]) {
            clearInterval(Butterfly.Timing.intervals[name]);
            delete Butterfly.Timing.intervals[name];
        }
    },

    intervalExists : function(name)
    {
        return Butterfly.Timing.intervals[name] != null ;
    },

    intervals : {},

    timeouts : {}

};
