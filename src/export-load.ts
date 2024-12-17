import { CONFIG } from "..";

export default function () {
    window.addEventListener("keydown", function (event) {
        if(event.key === "x") {
            exportScene()
        } else if(event.key === "l") {
            
        }
    });
}

function exportScene() {
    console.log(CONFIG.models)
    console.log(CONFIG.camera)
}