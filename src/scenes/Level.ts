import { IScene, App } from "../App";
import { Container, Sprite, Graphics, Loader, Text, TextStyle, Texture, ParticleContainer } from "pixi.js";
import { Emitter, EmitterConfig } from "pixi-particles";
import gsap from "gsap";
import { Card } from "./Card";
import { lvl1 } from "./../levels/Level_1_config";

export class Level extends Container implements IScene {

    private cardsSelected: Card[] = [];
    private currentLevel: typeof lvl1;

    constructor() {
        super();
        this.currentLevel = lvl1;
        for (let index = 0; index < 30; index++) {
            let card = new Card();
            card.x = (100 * (index % 5)) + card.width / 2;
            card.y = (100 + 100 * (Math.floor(index / 5))) + card.height / 2;
            this.addChild(card);
            card.card.on('pointerdown', () => {
                // TODO - disable all other cards for card flip
                this.cardsSelected.push(card);

                // this.cardsSelected.forEach(card => {
                card.state = "open";
                card.flip();
                // });

                //on unsuccessful attempt && second card open only!
                if (this.cardsSelected.length === 2) {
                    gsap.delayedCall(0.75, () => {
                        this.cardsSelected.forEach(card => {
                            card.state = this.cardsSelected.length === 2 ? "hidden" : "open";
                            card.flip();
                        });
                        this.cardsSelected = [];
                    })
                }
            });
        }
    }

    // private cardFlip(): void {
    //    
    // }

    public addBG() {

    }

    public update(time: number): void {

    }
}
