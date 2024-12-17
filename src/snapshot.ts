import { CONFIG } from "..";

export default function() {
    window.addEventListener("keydown", function (event) {
        if(event.key !== "s") return;

        CONFIG.renderer.domElement.toBlob(imgBlob => {
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = URL.createObjectURL(imgBlob);
            a.download = "render.png";
            a.click();
        }, "image/png", 1)
    })
}
