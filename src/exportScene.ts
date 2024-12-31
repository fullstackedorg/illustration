import fs from "fs";
import { CONFIG } from "./config";

type Vector3 = {
    x: number;
    y: number;
    z: number;
};

type SceneData = {
    camera: {
        position: Vector3;
        rotation: Vector3;
    };
    target: Vector3;
    models: {
        id: string;
        position: Vector3;
        rotation: Vector3;
        scale: Vector3;
    }[];
};

export async function load(file: string) {
    if (!(await fs.exists(file))) {
        return;
    }

    const data: SceneData = JSON.parse(
        await fs.readFile(file, { encoding: "utf8" }),
    );

    CONFIG.camera.position.set(
        data.camera.position.x,
        data.camera.position.y,
        data.camera.position.z,
    );
    CONFIG.camera.rotation.set(
        data.camera.rotation.x,
        data.camera.rotation.y,
        data.camera.rotation.z,
    );
    CONFIG.orbitControls.target.set(
        data.target.x,
        data.target.y,
        data.target.z,
    );
    CONFIG.orbitControls.update();

    data.models.forEach((m) => {
        const model = CONFIG.models.find(({ id }) => id === m.id);
        if (!model) return;
        model.model.position.set(m.position.x, m.position.y, m.position.z);
        model.model.rotation.set(m.rotation.x, m.rotation.y, m.rotation.z);
        model.model.scale.set(m.scale.x, m.scale.y, m.scale.z);
    });
}

export default function () {
    const file = "data/scene.json";
    window.addEventListener("keydown", async function (event) {
        if (event.key !== "x") return;

        const data: SceneData = {
            camera: {
                position: { ...CONFIG.camera.position },
                rotation: {
                    x: CONFIG.camera.rotation.x,
                    y: CONFIG.camera.rotation.y,
                    z: CONFIG.camera.rotation.z,
                },
            },
            target: { ...CONFIG.orbitControls.target },
            models: CONFIG.models.map((m) => ({
                id: m.id,
                position: { ...m.model.position },
                rotation: {
                    x: m.model.rotation.x,
                    y: m.model.rotation.y,
                    z: m.model.rotation.z,
                },
                scale: { ...m.model.scale },
            })),
        };

        if (!(await fs.exists("data"))) {
            await fs.mkdir("data");
        }
        fs.writeFile(file, JSON.stringify(data));
    });

    window.addEventListener("keydown", async function (event) {
        if (event.key !== "l") return;

        load(file);
    });
}
