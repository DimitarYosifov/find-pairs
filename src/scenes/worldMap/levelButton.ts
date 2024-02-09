import gsap from "gsap";
import { config } from "../../MainGameConfig";
import { Container, Sprite, TextStyle, Text } from "pixi.js";
import { Level } from "../level/Level";
import { App } from "../../App";

export class levelButton extends Container {

    constructor(x: number, y: number, state: string, level: number) {
        super();
        //bg
        let trampoline = Sprite.from("trampoline");
        trampoline.anchor.set(0.5);
        trampoline.position.set(x, y);
        this.addChild(trampoline);

        // lvl text
        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff'
        });
        let lvlText = new Text(`${level}`, style);
        lvlText.anchor.set(0.5);
        lvlText.style.fontSize = Math.ceil(33);
        lvlText.style.fontVariant = 'small-caps';
        trampoline.addChild(lvlText);

        lvlText.position.y -= 5;
        trampoline.scale.set(0.75);

        this.interactive = state !== "locked";
        this.alpha = state !== "locked" ? 1 : 0.5;

        if (state === "current") {
            gsap.to(trampoline.scale, 0.6,
                {
                    x: 0.8,
                    y: 0.8,
                    yoyo: true,
                    repeat: -1
                }
            )
        }

        this.on('pointerdown', () => {
            gsap.to(trampoline.scale, 0.2,
                {
                    x: 0.7,
                    y: 0.7
                }
            )
        })
        this.on('pointerup', () => {
            gsap.to(trampoline.scale, 0.2,
                {
                    x: 0.75,
                    y: 0.75,
                    onComplete: () => {
                        App.setScene(new Level());
                    }
                },
            )
        })
        this.on('pointerover', () => {

        })
    }
}
