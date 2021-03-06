define(['TRuntime'], function(TRuntime) {
    var CommandManager = function() {
        this.commands = new Array();
        this.logging= true;
    };
    
    CommandManager.prototype.addCommand = function(command, field) {
        if (typeof field === 'undefined') {
            // simple command provided
            this.commands.push(command);
        } else {
            // command with parameters
            if (typeof this.commands[field] === 'undefined') {
                this.commands[field] = new Array();
            }
            this.commands[field].push(command);
        }
    };
    
    CommandManager.prototype.removeCommands = function(field) {
        if (typeof field === 'undefined') {
            this.commands.length = 0;
        } else if (typeof this.commands[field] !== 'undefined') {
            this.commands[field] = undefined;
        }
    };
    
    CommandManager.prototype.executeCommands = function(parameters) {
        var i, parameter, field;
        if (typeof parameters !== 'undefined') {
            if (typeof parameters['parameter'] !== 'undefined') {
                parameter = parameters['parameter'];
            }
            if (typeof parameters['field'] !== 'undefined') {
                field = parameters['field'];
            }
        }
        if (typeof field === 'undefined') {
            TRuntime.execute(this.commands, parameter, this.logging);
        } else if (typeof this.commands[field] !== 'undefined') {
            TRuntime.execute(this.commands[field], parameter, this.logging);
        }
    };

    CommandManager.prototype.hasCommands = function(field) {
        if (typeof field === 'undefined') {
            return this.commands.length>0;
        } else {
            return ((typeof this.commands[field] !== 'undefined') && (this.commands[field].length>0));
        }
    };

    CommandManager.prototype.logCommands = function(value) {
        this.logging = value;
    };
    
    return CommandManager;
});


