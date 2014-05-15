// Marcus Kjeldsen
// duplicates comp and increments it's time remap frame expression

var org;
var orgName = "orgComp";
var naming = "ending";
var targetLayer = "sequence";
var instances = 10;

app.beginUndoGroup("Marcus' duplicator");

// find orgComp
for(var i = 0; i < app.project.rootFolder.numItems; i++) {
    if(app.project.rootFolder.items[i+1].name == orgName && app.project.rootFolder.items[i+1] instanceof CompItem){
        org = app.project.rootFolder.items[i+1];
        break;
    }
}

instances = org.workAreaDuration * org.frameDuration;
var containerFolder = app.project.items.addFolder("scriptedDuplicates");

// loop to create duplicates
for(var i = 0; i < instances; i++ ) {
    
    var c = org.duplicate();
    c.name = naming + i;
    c.parentFolder = containerFolder;
    target = c.layers.byName(targetLayer);
    target.property("Time Remap").expression = i + "* thisComp.frameDuration";

}

app.endUndoGroup();
