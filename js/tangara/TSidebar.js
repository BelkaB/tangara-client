define(['TUI', 'TEnvironment', 'TProgram', 'jquery'], function(TUI, TEnvironment, TProgram, $) {

    function TSidebar() {
        var domSidebar = document.createElement("div");
        domSidebar.id = "tsidebar";
    
        this.getElement = function() {
            return domSidebar;
        };
        
        this.displayed = function() {
            this.update();
        };
    
        this.update = function() {
            var project = TEnvironment.getProject();
            var programList = project.getProgramsNames();
            var editedPrograms = project.getEditedPrograms();
            var currentProgram = TUI.getCurrentProgram();
            var editedNames = [];
            var sidebar = this;
            
            domSidebar.innerHTML = "";

            function addElement(name, id, displayedName, edited, current) {
                var element = document.createElement("div");
                element.className = "tsidebar-program";
                if (edited) {
                    element.className += " tsidebar-edited";
                }
                if (typeof current !== 'undefined' && current) {
                    element.className += " tsidebar-current";
                }
                $(element).click(function(e){
                    if ($(this).hasClass('tsidebar-renaming'))
                        return false;
                    if (current) {
                        // rename program
                        $(this).addClass('tsidebar-renaming');
                        var renameElement = document.createElement("input");
                        renameElement.type="text";
                        renameElement.class="tsidebar-rename";
                        renameElement.value = name;
                        $(renameElement).keydown(function (e) {
                            if (e.which === 13) {
                                // Enter was pressed
                                TUI.renameProgram(name, renameElement.value);
                            }
                            if (e.which === 27) {
                                // Escape was pressed
                                $(this).parent().removeClass('tsidebar-renaming');
                                $(renameElement).remove();
                            }
                        });
                        renameElement.onblur = function() {TUI.renameProgram(name, renameElement.value);};
                        $(this).append(renameElement);
                        renameElement.focus();
                    } else {
                        // edit program
                        TUI.editProgram(name);e.stopPropagation();
                    }
                });
                var nameElement = document.createElement("div");
                nameElement.id = "tsidebar-program-"+id;
                nameElement.appendChild(document.createTextNode(displayedName));
                element.appendChild(nameElement);
                if (edited) {
                    var closeElement = document.createElement("div");
                    closeElement.className = "tsidebar-close";
                    closeElement.onclick = function(e) { TUI.closeProgram(name);e.stopPropagation();};
                    element.appendChild(closeElement);
                }
                domSidebar.appendChild(element);
            }

            var currentName = "";
            
            if (typeof currentProgram !== 'undefined') {
                currentName = currentProgram.getName();
            }

            for (var i=0; i<editedPrograms.length;i++) {
                var program = editedPrograms[i];
                var programName = program.getName();
                editedNames.push(programName);
                addElement(programName, program.getId(), program.getDisplayedName(), true, programName === currentName);
            }
            
            for (var i=0; i<programList.length;i++) {
                var name = programList[i];
                if (editedNames.indexOf(name) === -1) {
                    addElement(name, TProgram.findId(name), name, false);
                }
            }
        };
        
        this.updateProgramInfo = function(program) {
            var id = "#tsidebar-program-"+program.getId();
            $(id).text(program.getDisplayedName());
        };
        
        this.showLoading = function(name) {
            var id = "#tsidebar-program-"+TProgram.findId(name);
            var loadElement = document.createElement("div");
            loadElement.className = "tsidebar-loading";
            $(id).append(loadElement);
        };

        this.showRenaming = function(name) {
            var id = "#tsidebar-program-"+TProgram.findId(name);
            var loadElement = document.createElement("div");
            loadElement.className = "tsidebar-loading";
            $(id).parent().append(loadElement);
        };

        
        this.show = function() {
            $(domSidebar).show();
        };
        
        this.hide = function() {
            $(domSidebar).hide();
        };
        
    }
    
    return TSidebar;
});
