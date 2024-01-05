import { IScene, App } from "../App";
import { Container, Text, TextStyle } from "pixi.js";
import gsap from "gsap";
import { Card } from "./Card";
import { lvl1 } from "./../levels/Level_1_config";
import { config } from "../MainGameConfig";

export class Level extends Container implements IScene {

    private allCards: Card[] = [];
    private cardsSelected: Card[] = [];
    private currentLevel: typeof lvl1;
    private counter: Text;
    private time: number = 3;
    private timeLeft: number;
    private counterDelayedCall: gsap.core.Tween;
    private timeLeftCounter: Text;

    constructor() {
        super();
        this.currentLevel = lvl1;
        for (let index = 0; index < this.currentLevel.cardsCount; index++) {
            let type = this.getType();
            let card = new Card();
            card.type = type;
            this.allCards.push(card);
            card.x = (100 * (index % 5)) + card.width / 2;
            card.y = (100 + 100 * (Math.floor(index / 5))) + card.height / 2;
            this.addChild(card);
            card.card.on('pointerdown', () => {
                this.cardsSelected.push(card);
                this.setInteactive(false);
                card.state = "open";
                card.flip();

                if (this.cardsSelected.length === 2) {

                    this.setInteactive(false);
                    this.counter.visible = false;
                    gsap.killTweensOf(this.updateCounter)
                    // gsap.killTweensOf(this.counterDelayedCall)
                    // this.counterDelayedCall.kill();







                    if (this.cardsSelected[0].type === this.cardsSelected[1].type) {
                        //success
                        gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                            this.cardsSelected.forEach(card => {
                                card.state = "success";
                            });
                            this.setInteactive(true);
                            this.cardsSelected = [];
                            this.startCounter();
                        })
                    }
                    else {
                        gsap.delayedCall(0.75, () => {
                            gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                                this.cardsSelected.forEach(card => {
                                    card.state = "hidden";
                                    card.flip();
                                    this.setInteactive(true);
                                });
                                this.startCounter();
                                this.cardsSelected = [];
                            })
                        })
                    }
                } else {
                    gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                        // card.state = "hidden";
                        // card.flip(type);
                        this.setInteactive(true);
                    })
                    // gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
                    //     card.state = "hidden";
                    //     card.flip(type);
                    //     this.setInteactive(true);
                    // })
                }
            });
        }
        this.createCounters();
        this.startCounter();
        this.addTimeLeft();
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
            if (interactive === false || this.allCards[index].state === "open") {
                this.allCards[index].card.buttonMode = false;
                this.allCards[index].card.interactive = false;
            } else {
                this.allCards[index].card.buttonMode = this.allCards[index].state !== "success";
                this.allCards[index].card.interactive = this.allCards[index].state !== "success";
            }
        }
    }

    public createCounters(): void {
        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });

        this.counter = new Text(this.time, style);
        this.counter.anchor.set(0.5);
        this.counter.style.fontSize = Math.ceil(66);
        this.counter.position.set(270, 50);
        this.addChild(this.counter);
    }

    public startCounter(): void {
        this.time = 3;
        this.counter.text = this.time;
        this.counter.visible = true;
        this.counterDelayedCall = gsap.delayedCall(1, this.updateCounter, [this]);
    }

    public updateCounter(self: this): void {
        self.time--;
        //TODO - restart counter
        if (self.time === 0) {
            self.counter.text = self.time;
            // self.time = 3;

            if (self.cardsSelected.length === 1) {
                self.setInteactive(false);
                self.cardsSelected[0].flip();
                self.cardsSelected[0].state = "hidden";
                self.cardsSelected = [];
                gsap.delayedCall(1, () => {
                    // self.time = 3;
                    self.setInteactive(true);
                    self.startCounter();
                })
            }
            else {
                console.log(this);
                console.log(self);
                console.log(self.startCounter);

                // self.counterDelayedCall = 
                gsap.delayedCall(1, () => {
                    self.startCounter();
                });
                // self.startCounter();
            }
            // gsap.delayedCall(0.75, () => {
            //     gsap.delayedCall(config.cardFlipDuration * 1.1, () => {
            //         this.cardsSelected.forEach(card => {
            //             card.state = "hidden";
            //             card.flip(type);
            //             this.setInteactive(true);
            //         });
            //         this.startCounter();
            //         this.cardsSelected = [];
            //     })
            // })


            // self.time = 3;
            //TODO - hide cards
        } else {
            self.counter.text = self.time;
            self.counterDelayedCall = gsap.delayedCall(1, self.updateCounter, [self]);
        }
        // self.counter.text = self.time;

    }

    public addTimeLeft(): void {
        const update = () => {
            gsap.delayedCall(1, () => {
                this.timeLeft--;
                this.timeLeftCounter.text = this.timeLeft;
                if (this.timeLeft !== -1) {
                    update();
                } else {
                    //TODO - end level
                }
            });
        }

        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timeLeft = config.completionTime;
        this.timeLeftCounter = new Text(this.timeLeft, style);
        this.timeLeftCounter.anchor.set(0.5);
        this.timeLeftCounter.style.fontSize = Math.ceil(66);
        this.timeLeftCounter.position.set(470, 50);
        this.addChild(this.timeLeftCounter);
        update();
    }

    public addBG() {

    }

    public update(time: number): void {

    }
}
