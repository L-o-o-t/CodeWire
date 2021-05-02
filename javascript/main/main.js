import { AppStage } from '../AppStage/intiStage.js'
// import {SelectionBox} from '../SelectionBox/SelectionBox.js'
import { DragAndDrop } from '../DragAndDrop/DragAndDrop.js'
import { Wiring } from '../Wiring/Wiring.js'
import { ContextMenu } from '../ContextMenu/contextMenu.js'
import { leftPanel } from '../LeftPanel/LeftPanel.js'
import { VSToJS } from '../VSToJS/VStoJS.js'
import { Delete } from '../Delete/delete.js'
import { Export, Import, Save, prompLastSave } from '../SaveAndLoad/SaveAndLoad.js'
import { showAlert, prompRefreshOrStarter } from './alertBox.js'
// var width = window.innerWidth;
// var height = window.innerHeight;
let stage = AppStage.getStage(document.getElementById("container").clientWidth, document.getElementById("container").clientHeight, 'container');
var layer = new Konva.Layer({
    id: 'main_layer'
});
let dragLayer = new Konva.Layer({
    id: 'dragLayer',
});
stage.add(layer);
stage.add(dragLayer);
stage.container().style.backgroundPosition = `${stage.position().x} ${stage.position().y}`;

// stage.on("wheel", () => {
//     if (inputIsFocused) {
//         document.getElementById("number-ip").blur();
//         document.getElementById("string-ip").blur();
//         document.getElementById("bool-ip").blur();
//     }
// });
// SelectionBox.setSelectionBox(layer, stage);
Delete.enableDelete(stage, layer);
// DragAndDrop.DragAndDrop(stage, layer);
Wiring.enableWiring(stage, layer);
ContextMenu.contextMenu(stage, layer);
let panel = new leftPanel();
// layer.toggleHitCanvas();
// document.getElementById("number-ip").value = 12;
layer.draw();
document.getElementById("Run").addEventListener("click", (e) => {
    try {
        new VSToJS(stage, layer, "Run");
    }
    catch (err) {

    }
});
// stage.on('mouseup', () => {
//     console.log("x");
// })

new Save(stage, layer, stage.findOne('#wireLayer'));
new Export(stage, layer, stage.findOne('#wireLayer'));
// let script = `{"variables":[{"name":"sadsad","dataType":"Number","value":"0"},{"name":"sadsaddd","dataType":"Array","value":"[1,2]"}],"nodesData":[{"position":{"x":511,"y":16},"nodeDescription":{"nodeTitle":"Begin","execIn":false,"pinExecInId":null,"execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"10"}},"rows":2,"colums":10}},{"position":{"x":968,"y":98},"nodeDescription":{"nodeTitle":"Print","execIn":true,"pinExecInId":"16","execOut":{"execOut0":{"execOutTitle":null,"pinExecOutId":"17"}},"inputs":{"input0":{"inputTitle":"Value","dataType":"Data","defValue":"hello","pinInId":"18"}},"rows":3,"colums":12}},{"position":{"x":706,"y":89},"nodeDescription":{"nodeTitle":"Branch","execIn":true,"pinExecInId":"28","execOut":{"execOut0":{"execOutTitle":"       True","pinExecOutId":"29"},"execOut1":{"execOutTitle":"       False","pinExecOutId":"31"}},"inputs":{"input0":{"inputTitle":"Bool","dataType":"Boolean","defValue":true,"pinInId":"33"}},"rows":3,"colums":12}}],"wireData":[{"srcId":"31","destId":"16"},{"srcId":"29","destId":"16"},{"srcId":"10","destId":"28"}]}`;
document.getElementById("import").addEventListener("click", () => {
    // document.getElementById("save-menu").classList.toggle("hidden", true);
    // document.getElementById("saving").classList.toggle("hidden", true);
    let importMenu = document.getElementById("import-menu");
    [...document.getElementsByClassName("sidebox")].forEach(value => {
        if (value !== importMenu) {
            value.classList.toggle("hidden", true);
        }
        else {
            value.classList.toggle("hidden", false);
        }
    })
    document.getElementById("import-btn").addEventListener("click", (e) => {

        let file = document.getElementById("upload-json").files;
        if (file.length == 0) {
            showAlert("Upload File First");
        }
        else {
            try {
                document.getElementById("import-menu").classList.toggle("hidden", true);
                let fr = new FileReader();
                fr.onload = function (e) {
                    // let result = JSON.parse(e.target.result);
                    // console.log(result);
                    let script = e.target.result
                    new Import(stage, layer, stage.findOne('#wireLayer'), script);
                    document.getElementById("import-menu").classList.toggle("hidden", true);
                }
                fr.readAsText(file.item(0));
            }
            catch (err) {
                document.getElementById("console-window").classList.toggle("hidden", false);
                let codeDoc = document.getElementById("console").contentWindow.document;
                codeDoc.open();
                codeDoc.writeln(
                    `<!DOCTYPE html>\n
                    <style>
                        html{
                            color: white;
                            margin: 20;
                        }
                    </style>
                    <body>
                    <code>
                    "Error Occurred In Importing The JSON"<br>
                    ${err}
                    </code>
                    </body>
                    </html>
                    `
                );
                codeDoc.close();
            }
        }
    });
})
document.getElementById("Code").addEventListener("click", () => {
    new VSToJS(stage, layer, "Code");
});
document.getElementById("Console").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden");
})
document.getElementById("cross-console").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden", true);
});
document.getElementById("cross-upload-cross").addEventListener("click", (e) => {
    document.getElementById("import-menu").classList.toggle("hidden", true);
});
document.getElementById("reload").addEventListener("click", (e) => {
    prompLastSave(stage, layer, stage.findOne('#wireLayer'));
});

document.getElementById("refresh").addEventListener("click", (e) => {
    prompRefreshOrStarter("refresh" , stage);
});
document.getElementById("starter").addEventListener("click", (e) => {
    prompRefreshOrStarter("starter", stage);
})

document.getElementById("Tutorial").addEventListener("click", (e) => {
    document.getElementById("console-window").classList.toggle("hidden", false);
    let codeDoc = document.getElementById("console").contentWindow.document;
    codeDoc.open();
    codeDoc.writeln(
        `<!DOCTYPE html>\n
                    <style>
                        html{
                            color: white;
                            margin: 20;
                        }
                    </style>
                    <body>
                    <code>
                    <ol>
                    <li>Include Begin Node By Right Click And Select Begin</li>
                    <li>Include Other In The Same Way</li>
                    <li>Use Left Panel To create New Variable</li>
                    <li>New variable is added into the right click menu</li>
                    <li>Hold middle mouse button To Pan</li>
                    <li>Use Scroll Wheel To Zoom in and out</li>
                    <li>Hold left Ctrl and click the node or the wire to delete it</li>
                    <li>White wire between two arrow terminals is used for execution flow</li>
                    <li>Colored wire is used for input/outputs</li>
                    <li>Click Code to get Javascript native code</li>
                    </ol>
                    </code>
                    </body>
                    </html>
                    `
    );
    codeDoc.close();
}
);

