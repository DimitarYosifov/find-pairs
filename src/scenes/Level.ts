import { IScene, App } from "../App";
import { Container, Sprite, Graphics, Loader, Text, TextStyle, Texture, ParticleContainer } from "pixi.js";
import { Emitter, EmitterConfig } from "pixi-particles";
import gsap from "gsap";
import { Card } from "./Card";
import { lvl1 } from "./../levels/Level_1_config";
import { config } from "../MainGameConfig";

export class Level extends Container implements IScene {

    private allCards: Card[] = [];
    private cardsSelected: Card[] = [];
    private currentLevel: typeof lvl1;

    constructor() {
        super();
        this.currentLevel = lvl1;
        for (let index = 0; index < this.currentLevel.cardsCount; index++) {
            let type = this.getType();
            let card = new Card();
            this.allCards.push(card);
            card.x = (100 * (index % 5)) + card.width / 2;
            card.y = (100 + 100 * (Math.floor(index / 5))) + card.height / 2;
            this.addChild(card);
            card.card.on('pointerdown', () => {
                this.cardsSelected.push(card);
                this.setInteactive(false);
                card.state = "open";
                card.flip(type);

                if (this.cardsSelected.length === 2) {

                    this.setInteactive(false);

                    if (this.cardsSelected[0].type === this.cardsSelected[1].type) {
                        //success
                        gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                            this.cardsSelected.forEach(card => {
                                card.state = "success";
                            });
                            this.setInteactive(true);
                            this.cardsSelected = [];
                        })
                    }
                    else {
                        gsap.delayedCall(0.75, () => {
                            this.cardsSelected.forEach(card => {
                                card.state = "hidden";
                                card.flip(type);
                                gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                                    this.setInteactive(true);
                                })
                            });
                            this.cardsSelected = [];
                        })
                    }
                } else {
                    gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                        this.setInteactive(true);
                    })
                }
            });
        }
    }

    private getType(): string {
        let typesCount = this.currentLevel.in_lvl_card_ids.length;
        let typeFound = false;
        let type = "";
        while (!typeFound) {
            let rnd = Math.floor(Math.random() * typesCount);
            if (this.currentLevel.in_lvl_card_ids[rnd].count > 0) {
                typeFound = true;
                this.currentLevel.in_lvl_card_ids[rnd].count--;
                type = this.currentLevel.in_lvl_card_ids[rnd].type;
            }
        }
        return type;
    }

    private setInteactive(interactive: boolean): void {
        for (let index = 0; index < this.currentLevel.cardsCount; index++) {
            if (interactive === false) {
                this.allCards[index].card.buttonMode = false;
                this.allCards[index].card.interactive = false;
            } else {
                this.allCards[index].card.buttonMode = this.allCards[index].state !== "success";
                this.allCards[index].card.interactive = this.allCards[index].state !== "success";
            }
        }
    }

    public addBG() {

    }

    public update(time: number): void {

    }
}
