import { CONFIG } from "..";

export default function () {
    window.addEventListener("keydown", function (event) {
        if (event.key !== "x") return;

        console.log(CONFIG.models);
        console.log(CONFIG.camera);
    });
}
