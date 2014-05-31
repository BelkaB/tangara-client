define(['jquery','TEnvironment', 'TObject', 'TUtils', 'TRuntime'], function($, TEnvironment, TObject, TUtils, TRuntime) {
    var Sequence = function() {
        TObject.call(this);
        this.actions = new Array();
        this.index = -1;
        this.running = false;
        this.timeout = null;
        this.loop = false;
        this.wasRunning = false;
    };
    
    Sequence.prototype = Object.create(TObject.prototype);
    Sequence.prototype.constructor = Sequence;
    Sequence.prototype.className = "Sequence";    
    
    Sequence.TYPE_COMMAND = 0x01;
    Sequence.TYPE_DELAY = 0x02;
    Sequence.MINIMUM_LOOP = 100;
    
    Sequence.prototype._addCommand = function(command) {
        if (TUtils.checkCommand(command)) {
            this.actions.push({type:Sequence.TYPE_COMMAND,value:command});
        } else {
            throw new Error(this.getMessage("wrong command"));
        }
    };

    Sequence.prototype._addDelay = function(delay) {
        if (TUtils.checkInteger(delay)) {
            this.actions.push({type:Sequence.TYPE_DELAY,value:delay});
        } else {
            throw new Error(this.getMessage("wrong delay"));
        }
    };
    
    Sequence.prototype.nextAction = function() {
        this.timeout = null;
        this.index++;
        if (this.actions.length > 0 && this.running) {
            if (this.index >= this.actions.length) {
                if (this.loop) {
                    this.index = 0;
                } else {
                    // last action reached: we stop here
                    this.running = false;
                    return;
                }
            }
            var action = this.actions[this.index];
            if (action.type === Sequence.TYPE_COMMAND) {
                // execute command
                TRuntime.execute(action.value);
                this.nextAction();
            } else if (action.type === Sequence.TYPE_DELAY) {
                var self = this;
                this.timeout = window.setTimeout(function() { self.nextAction(); }, action.value);
            }
        }
    };
    
    Sequence.prototype._start = function() {
        if (this.running) {
            // Sequence is already running: restart it
            this.stop();
        }
        this.running = true;
        this.index = -1;
        this.nextAction();
    };

    Sequence.prototype._stop = function() {
        this.running = false;
        this.index = -1;
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    
    Sequence.prototype._pause = function() {
        this.running = false;
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    
    Sequence.prototype._unpause = function() {
        this.running = true;
        this.nextAction();
    };

    Sequence.prototype._delete = function() {
        this.stop();
        TObject.prototype._delete.call(this);
    };

    Sequence.prototype._loop = function(value) {
        if (TUtils.checkBoolean(value)) {
            if (value) {
                // WARNING: in order to prevent Tangara freeze, check that there is at least a total delay of MINIMUM_LOOP in actions
                var totalDelay = 0;
                for (var i=0; i<this.actions.length;i++) {
                    var action = this.actions[i];
                    if (action.type === Sequence.TYPE_DELAY) {
                        totalDelay += action.value;
                    }
                }
                if (totalDelay < Sequence.MINIMUM_LOOP) {
                    throw new Error(this.getMessage("freeze warning",Sequence.MINIMUM_LOOP));
                }
            }            
            this.loop = value;
        }
    };
    
    Sequence.prototype.freeze = function(value) {
        TObject.prototype.freeze.call(value);
        if (value) {
            this.wasRunning = this.running;
            this._pause();
        } else {
            if (this.wasRunning) {
                this._unpause();
            }
        }
    };

    
    TEnvironment.internationalize(Sequence, true);
    
    return Sequence;
});

