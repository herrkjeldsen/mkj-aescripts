﻿/*
    Name: mkj_randomStagger
    Version: 0.9
    
    Marcus Kjeldsen 2014
    Basic script to random or stagger time offset for selected keyframes. Stagger only works from top to bottom right now
    Does not keep easing or keyframe type!
    
    Inspired by asu_NudgeKeyFrames.jsx by Anders Sundstedt (sundstedt.se)
    Special thanks to David Torno for UI help.
    
    TODO :: Option to stagger opposite direction
    TODO :: Option to stagger uniformly from cti
    TODO :: Modularize the duplicate code
*/

// *****************  FUNCTIONS ***************** //



function randRange(min, max) {return (Math.random() * (max - min + 1)) + min;}


function shiftKeysRandom(randomness) { // shifts selected keyframes by random amount
        
    var proj = app.project;
    var undoStr = "Random Keyframe Time Offset";
    
    if (proj){
        var myComp = app.project.activeItem;
        if (myComp != null && (myComp instanceof CompItem)){

            app.beginUndoGroup(undoStr);
            
            var fps = myComp.frameRate;

            var myLayers = myComp.selectedLayers;
            if (myLayers.length > 0){
                
                var props = myComp.selectedProperties;
                var propSelection = [];
                
                // get selected
                for (i=0; i < props.length; i++){
                    if(props[i].selectedKeys != undefined) {
                        var keys = [];
                        for (j=0; j < props[i].selectedKeys.length; j++){
                            keys.push(props[i].selectedKeys[j]);
                        }
                        var propObj = {
                                prop:props[i],
                                keys:keys
                            }
                        propSelection.push(propObj);
                    }
                }
                
                var reselectKeys = [];
                
                for (i=0; i < propSelection.length; i++){
                    
                    var keys = propSelection[i].keys;
                    var newKeys = [];
                    
                    
                    
                    // read keys
                    for (j=0; j < propSelection[i].keys.length; j++){
                        var prop = propSelection[i].prop;
                        var kIndex = propSelection[i].keys[j];
                        var kTime = propSelection[i].prop.keyTime(kIndex);
                        var kVal = propSelection[i].prop.keyValue(kIndex);
                       
                        var val = randRange(-1, 1) * randomness;
                        var newTime = kTime + (val / fps);
                        
                        var keyObj = {
                            prop:propSelection[i].prop, // don't really need this i guess
                            oldTime:kTime,
                            newTime:newTime,
                            val:kVal
                            } // add interpolations
                        
                         newKeys.push(keyObj);
                    }
                
                    // removeKeys
                    for (j=0; j < newKeys.length; j++){
                        var obj = newKeys[j];
                        var k = propSelection[i].prop.nearestKeyIndex(obj.oldTime);
                        propSelection[i].prop.removeKey(k);
                    }
                
                    // createKeys
                    for (j=0; j < newKeys.length; j++){
                        var obj = newKeys[j];
                        var k = propSelection[i].prop.nearestKeyIndex(obj.newTime);
                        var newKey = propSelection[i].prop.addKey(obj.newTime);
                        propSelection[i].prop.setValueAtTime(obj.newTime, obj.val);
                    }
                
                    reselectKeys.push(newKeys);
                }
            
                // reselect keys
                for (i=0; i < reselectKeys.length; i++){
                    for (j=0; j < reselectKeys[i].length; j++){
                        var keyframe = reselectKeys[i][j];
                        var key = keyframe.prop.nearestKeyIndex(keyframe.newTime);
                        keyframe.prop.setSelectedAtKey(key, true);
                    }
                }

            } else {
                alert("Please select a layer in the comp to use this script");
            }
        
            app.endUndoGroup();
            
        } else {
            alert("Please select an active comp to use this script");
        }

    } else {
        alert("Please open a project first to use this script.");
    }
} // end shiftKeysRandom()



function staggerKeys(offset) { // shifts selected keyframes by offset amount

    var proj = app.project;
    var undoStr = "Stagger Keyframe Time Offset";
    
    if (proj){
        var myComp = app.project.activeItem;
        if (myComp != null && (myComp instanceof CompItem)){

            app.beginUndoGroup(undoStr);
            
            var fps = myComp.frameRate;

            var myLayers = myComp.selectedLayers;
            if (myLayers.length > 0){
                
                var props = myComp.selectedProperties;
                var propSelection = [];
                
                // get selected
                for (i=0; i < props.length; i++){
                    if(props[i].selectedKeys != undefined) {
                        var keys = [];
                        for (j=0; j < props[i].selectedKeys.length; j++){
                            keys.push(props[i].selectedKeys[j]);
                        }
                        var propObj = {
                                prop:props[i],
                                keys:keys
                            }
                        propSelection.push(propObj);
                    }
                }
                
                var reselectKeys = [];
                
                for (i=0; i < propSelection.length; i++){
                    
                    var keys = propSelection[i].keys;
                    var newKeys = [];
                    
                    
                    
                    // read keys
                    for (j=0; j < propSelection[i].keys.length; j++){
                        var prop = propSelection[i].prop;
                        var kIndex = propSelection[i].keys[j];
                        var kTime =  propSelection[i].prop.keyTime(kIndex);
                        var kVal =  propSelection[i].prop.keyValue(kIndex);
                       
                        var val = i * offset;
                        var newTime = kTime + (val / fps);
                        
                        var keyObj = {
                            prop:propSelection[i].prop,
                            oldTime:kTime,
                            newTime:newTime,
                            val:kVal
                            } // add interpolations
                        
                         newKeys.push(keyObj);
                    }
                
                
                    // removeKeys
                    for (j=0; j < newKeys.length; j++){
                        var obj = newKeys[j];
                        var k = propSelection[i].prop.nearestKeyIndex(obj.oldTime);
                        propSelection[i].prop.removeKey(k);
                    }
                
                    // createKeys
                    for (j=0; j < newKeys.length; j++){
                        var obj = newKeys[j];
                        var k = propSelection[i].prop.nearestKeyIndex(obj.newTime);
                        //propSelection[i].prop.addKey(obj.newTime);
                        propSelection[i].prop.setValueAtTime(obj.newTime, obj.val);
                    }
                    
                    reselectKeys.push(newKeys);
                }
                
                // reselect keys
                for (i=0; i < reselectKeys.length; i++){
                    for (j=0; j < reselectKeys[i].length; j++){
                        var keyframe = reselectKeys[i][j];
                        var key = keyframe.prop.nearestKeyIndex(keyframe.newTime);
                        keyframe.prop.setSelectedAtKey(key, true);
                    }
                }

            } else {
                alert("Please select a layer in the comp to use this script");
            }
        
            app.endUndoGroup();
            
        } else {
            alert("Please select an active comp to use this script");
        }

    } else {
        alert("Please open a project first to use this script.");
    }
} // end staggerKeys()





// *****************  UI ***************** //

function panelUI(obj) {
    function createPanelUI(obj) {
        var myPanel = (obj instanceof Panel) ? obj : new Window("palette", "MKJ-KEYFRAMEOFFSET", undefined, {resizeable:true});
        
        // the gui:
        res = "group{orientation:'column',\
                    pGroup: Group{orientation:'column',\
                        amountText: StaticText{text:'Amount', alignment:['fill','top'], justify:'left'},\
                        amount: EditText{text:'1', alignment:['fill','top'], justify:'center'},\
                        randomBtn: Button{text:'Random'},\
                        staggerBtn: Button{text:'Stagger'},\
                    }},\
                }";
                
        myPanel.grp = myPanel.add(res);
        
        myPanel.layout.layout(true);
        myPanel.layout.minimumSize = myPanel.grp.size;
        myPanel.layout.resize();
        myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};
        
        myPanel.grp.pGroup.randomBtn.onClick = function() {shiftKeysRandom(myPanel.grp.pGroup.amount.text);};
        myPanel.grp.pGroup.staggerBtn.onClick = function() {staggerKeys(myPanel.grp.pGroup.amount.text);};
        
        return myPanel;
    }

    var myScriptPal = createPanelUI(obj);
    
    if((myScriptPal != null) && (myScriptPal instanceof Window)) {
        myScriptPal.center();
        myScriptPal.show();
    }
}

panelUI(this);
