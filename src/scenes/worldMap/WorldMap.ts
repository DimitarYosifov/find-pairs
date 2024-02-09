import { IScene, App } from "../../App";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import gsap from "gsap";
import { config } from "../../MainGameConfig";
import { levelButton } from "./levelButton";

export class WorldMap extends Container implements IScene {

    private lvl_coords: levelCoords;

    constructor() {
        super();
        this.addBG();
        this.lvl_coords = {
            //  TODO... state should not be here
            // state - locked, passed or current
            1: { x: 100, y: 900, state: "passed" },
            2: { x: 175, y: 800, state: "passed" },
            3: { x: 125, y: 700, state: "current" },
            4: { x: 175, y: 600, state: "locked" },
            5: { x: 125, y: 500, state: "locked" },
            6: { x: 100, y: 400, state: "locked" },
        }
        this.addLevels();
    }
    private addLevels() {
        Object.keys(this.lvl_coords).forEach(element => {
            let lvlButton = new levelButton(
                this.lvl_coords[element].x,
                this.lvl_coords[element].y,
                this.lvl_coords[element].state,
                +element
            );
            this.addChild(lvlButton);
        });
    }

    public update(framesPassed: number): void { }

    public addBG(): void {
        let bg = Sprite.from("world-bg");
        bg.width = 540;
        bg.height = 960;
        this.addChild(bg);
    }


}

interface ICoords {
    x: number;
    y: number;
    state: string;
}

type levelCoords = { [key: string]: ICoords };
