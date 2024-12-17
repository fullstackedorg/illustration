import { CONFIG } from "..";

export default function () {
    window.addEventListener("keydown", function (event) {
        if (event.key !== "s") return;

        const originalBackground = CONFIG.scene.background;
        CONFIG.scene.background = null;

        setTimeout(() => {
            CONFIG.renderer.domElement.toBlob(
                (imgBlob) => {
                    const a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style.display = "none";
                    a.href = URL.createObjectURL(imgBlob);
                    a.download = "render.png";
                    a.click();
                    CONFIG.scene.background = originalBackground;
                },
                "image/png",
                1,
            );
        }, 100);
    });
}
