import { IScene, App } from "../../App";
import { Container, Graphics, ParticleContainer, Sprite, Text, TextStyle, Texture } from "pixi.js";
import gsap from "gsap";
import { Card } from "./Card";
import { lvl1 } from "../../levels/Level_1_config";
import { config } from "../../MainGameConfig";
import { Emitter, EmitterConfig } from "pixi-particles";

export class Level extends Container implements IScene {

    private allCards: (Card | null)[] = [];
    private cardsSelected: Card[] = [];
    private currentLevel: typeof lvl1;
    private counter: Text;
    private time: number = 3;
    private timeLeft: number;
    private movesLeft: number;
    private movesLeftText: Text;
    private counterDelayedCall: gsap.core.Tween;
    private timeLeftCounter: Text;
    private cardsContainer: Container = new Container;
    private totalCardFieldsCount: number;
    private leftCurtain: Sprite;
    private rightCurtain: Sprite;
    private curtainsTweens: GSAPTween[] = [];
    private levelPassed: boolean = false;
    private totalCardsToFlip: number;
    private loaderBarBorder: Graphics = new Graphics;
    private loaderBarFill: Graphics = new Graphics;
    private loaderBar: Container = new Container;
    private initialCardsCount: number;
    private levelStarsArray: Sprite[] = [];
    private starsEarned: number = 0;
    private emitters: Emitter[] = [];

    constructor() {
        super();
        this.currentLevel = lvl1;
        this.validateLevel();
        this.addBG();
        let columns = this.currentLevel.dimentions[0].length;
        this.totalCardFieldsCount = this.currentLevel.dimentions[0].length * lvl1.dimentions.length;
        this.totalCardsToFlip = this.currentLevel.in_lvl_card_ids.map(x => x.count).reduce((a, b) => a + b);
        this.initialCardsCount = this.totalCardsToFlip;
        for (let index = 0; index < this.totalCardFieldsCount; index++) {

            let row = Math.floor(index / columns);
            let col = index % columns;

            if (this.currentLevel.dimentions[row][col] !== 1) {
                this.allCards.push(null);
                continue;
            }

            let type = this.getType();
            let card = new Card();
            card.type = type;
            this.allCards.push(card);
            card.x = (75 * (index % columns)) + card.width / 2;
            card.y = (100 * (Math.floor(index / columns))) + card.height / 2;
            this.cardsContainer.addChild(card);
            card.card.on('pointerdown', () => {

                //test
                // this.particles(card.x, card.y, card.width, card.height);

                this.cardsSelected.push(card);
                this.setInteactive(false);
                card.state = "open";
                card.flip();

                if (this.cardsSelected.length === 2) {
                    this.updateMoves();
                    this.setInteactive(false);
                    this.counter.visible = false;
                    gsap.killTweensOf(this.updateCounter);
                    if (this.cardsSelected[0].type === this.cardsSelected[1].type) {
                        //success
                        gsap.delayedCall(config.cardFlipDuration * 1.1, () => {

                            this.cardsSelected.forEach(card => {
                                card.state = "success";
                                card.playCelebration();
                            });

                            this.cardsSelected.forEach(c => {
                                const x = c.x;
                                const y = c.y;
                                const w = c.width;
                                const h = c.height;
                                gsap.delayedCall(0.4, () => {
                                    this.particles(x, y, w, h);
                                })
                            });

                            this.cardsSelected = [];
                            this.totalCardsToFlip -= 2;

                            this.updateLevelProgress();

                            if (this.totalCardsToFlip === 0) {
                                this.levelPassed = true;
                                this.endLevel(true);
                            }
                            this.setInteactive(true);
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
                        this.setInteactive(true);
                    })
                }
            });
        }

        this.cardsContainer.x = App.width / 2 - this.cardsContainer.width / 2;
        this.cardsContainer.y = App.height / 2 - this.cardsContainer.height / 2;

        this.addChild(this.cardsContainer);

        this.addCurtains();
        this.levelStartCounter();
    }

    private startGame(): void {
        this.createCounters();
        this.startCounter();
        this.addTimeLeft();
        this.addMoves();
        this.levelProgress();
        this.levelStars();
    }

    private addCurtains(): void {
        //curtain left
        this.leftCurtain = Sprite.from("curtains");
        this.leftCurtain.width = 325;
        this.leftCurtain.height = 1030;
        this.leftCurtain.position.set(-10, -50);
        this.leftCurtain.interactive = true;
        this.addChild(this.leftCurtain);
        //--------------------------
        //curtain right
        this.rightCurtain = Sprite.from("curtains");
        this.rightCurtain.width = 325;
        this.rightCurtain.height = 1030;
        this.rightCurtain.scale.x *= -1;
        this.rightCurtain.position.set(590, -50);
        this.rightCurtain.interactive = true;
        this.addChild(this.rightCurtain);
    }

    private levelStartCounter(): void {
        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff'
        });
        let counter = 3;
        let counterText = new Text(`${counter}`, style);
        counterText.anchor.set(0.5);
        counterText.style.fontSize = 170;
        counterText.position.set(App.width / 2, App.height / 2);
        this.addChild(counterText);

        let a = gsap.timeline();

        for (let index = 0; index < 3; index++) {
            a.fromTo(counterText.scale, 1,
                {
                    x: 0,
                    y: 0,
                },
                {
                    ease: "Back.easeOut",
                    x: 1,
                    y: 1,
                    onComplete: () => {
                        counter--;
                        if (counter > 0) {
                            counterText.text = counter;
                        }
                        else {
                            this.removeChild(counterText);
                            this.openCurtains();
                        }
                    }
                }
            )
        }
    }

    private openCurtains(): void {
        let leftCurtainTween1 = gsap.to(this.leftCurtain.skew, 1.5,
            {
                ease: "back.out",
                // delay: 1,
                x: -0.22
            }
        )
        let leftCurtainTween2 = gsap.to(this.leftCurtain, 1.5,
            {
                delay: 0.25,
                width: 50,
                x: -142,
                onStart: () => {
                    this.startGame();
                }
            }
        )
        this.curtainsTweens.push(leftCurtainTween1);
        this.curtainsTweens.push(leftCurtainTween2);
        let rightCurtainTween1 = gsap.to(this.rightCurtain.skew, 1.5,
            {
                ease: "back.out",
                // delay: 1,
                x: 0.22
            }
        )
        let rightCurtainTween2 = gsap.to(this.rightCurtain, 1.5,
            {
                delay: 0.25,
                width: 50,
                x: 722
            }
        )
        this.curtainsTweens.push(rightCurtainTween1);
        this.curtainsTweens.push(rightCurtainTween2);
    }

    private endLevel(gameWon: boolean): void {
        this.interactiveChildren = false;
        this.removeChild(this.counter);
        this.closeCurtains();
    }

    private closeCurtains(): void {
        this.curtainsTweens.forEach(t => {
            t.reverse();
        });
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
        for (let index = 0; index < this.totalCardFieldsCount; index++) {

            if (!this.allCards[index]) {
                continue;
            }

            if (interactive === false || this.allCards[index]!.state === "open") {
                this.allCards[index]!.card.buttonMode = false;
                this.allCards[index]!.card.interactive = false;
            } else {
                this.allCards[index]!.card.buttonMode = this.allCards[index]!.state !== "success";
                this.allCards[index]!.card.interactive = this.allCards[index]!.state !== "success";
            }
        }
    }

    public createCounters(): void {
        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff',
            // stroke: '#000000',
            // strokeThickness: 2
        });

        this.counter = new Text(this.time, style);
        this.counter.anchor.set(0.5);
        this.counter.style.fontSize = Math.ceil(22);
        this.counter.style.fontVariant = 'small-caps';
        this.counter.style.fontStyle = 'italic';
        this.counter.position.set(50, 50);
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

        if (self.timeLeft <= 0 || self.movesLeft <= 0) {
            return;
        }


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

    public updateMoves(): void {
        this.movesLeft--;
        this.movesLeftText.text = `moves: ${this.movesLeft} `;
        if (this.movesLeft === 0) {
            this.endLevel(false);
        }
    }

    public addMoves(): void {
        this.movesLeft = this.currentLevel.moves;

        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff'
        });

        this.movesLeftText = new Text(`moves: ${this.movesLeft} `, style);
        this.movesLeftText.anchor.set(0.5);
        this.movesLeftText.style.fontSize = Math.ceil(22);
        this.movesLeftText.style.fontVariant = 'small-caps';
        this.movesLeftText.style.fontStyle = 'italic';
        this.movesLeftText.position.set(450, 30);
        this.addChild(this.movesLeftText);
    }

    public addTimeLeft(): void {
        const update = () => {
            gsap.delayedCall(1, () => {
                this.timeLeft--;
                this.timeLeftCounter.text = `time left: ${this.timeLeft} `;
                if (this.timeLeft === 0 || this.movesLeft <= 0) {
                    this.endLevel(false);
                    return;
                } else if (this.levelPassed) {
                    return;
                }
                if (this.timeLeft !== -1) {
                    update();
                }
                else {
                    //TODO - end level //?? WTF
                }
            });
        }

        const style = new TextStyle({
            fontFamily: config.mainFont,
            fill: '#ffffff',
            // stroke: '#000000',
            // strokeThickness: 2
        });
        this.timeLeft = this.currentLevel.completionTime;
        this.timeLeftCounter = new Text(`time left: ${this.timeLeft}`, style);
        this.timeLeftCounter.anchor.set(0.5);
        this.timeLeftCounter.style.fontSize = Math.ceil(22);
        this.timeLeftCounter.style.fontVariant = 'small-caps';
        this.timeLeftCounter.style.fontStyle = 'italic';
        this.timeLeftCounter.position.set(450, 55);
        this.addChild(this.timeLeftCounter);
        update();
    }

    public addBG() {
        let bg = Sprite.from("bg");
        bg.width = 540;
        bg.height = 960;
        this.addChild(bg);
    }

    private validateLevel(): void {
        let totalCards = this.currentLevel.dimentions.map(x => x.filter(e => e === 1).length).reduce((a, b) => a + b);
        let totalCardIds = this.currentLevel.in_lvl_card_ids.map(x => x.count).reduce((a, b) => a + b);
        if (totalCards !== totalCardIds) {
            // elements set as "ones" in dimention arrays
            // do not match in_lvl_card_ids count
            alert("cards defined in dimention arrays do not match cards count");

        }
    }

    private levelProgress(): void {

        this.loaderBarBorder.beginFill(0x000000, 1);
        this.loaderBarBorder.drawRoundedRect(0, 0, App.width * 0.8, 20, 11);
        this.loaderBarBorder.endFill();

        this.loaderBarFill.beginFill(0xebad1e, 1);// yellow 
        this.loaderBarFill.drawRoundedRect(0, 0, App.width * 0.5, 20, 11);
        this.loaderBarFill.alpha = 0;

        this.loaderBar.addChild(this.loaderBarBorder);
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.position.x = (App.width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (App.height - this.loaderBar.height) * 0.97;
        this.addChild(this.loaderBar);
    }

    private updateLevelProgress(): void {
        let cardsLeft = this.totalCardsToFlip;
        let progress = ((this.initialCardsCount - cardsLeft) / this.initialCardsCount).toFixed(2);

        let ease = "back.in";
        if (this.initialCardsCount - 2 === this.totalCardsToFlip) {
            this.loaderBarFill.width = 0;
            ease = "linear"
        }
        this.loaderBarFill.alpha = 1;
        gsap.to(this.loaderBarFill, 0.45,
            {
                ease: ease,
                width: App.width * 0.8 * +progress
            }
        )

        if (+progress >= this.currentLevel.starsLevels[this.starsEarned] / 100) {
            this.updateStars();
        }
    }

    private levelStars(): void {

        let h = this.loaderBar.height / 2;

        this.currentLevel.starsLevels.forEach(starLvl => {
            let star = Sprite.from("star");
            star.anchor.set(0.5);
            star.scale.set(0.2);
            star.alpha = 0.55;
            star.position.set(this.loaderBar.width * starLvl / 100, h);
            this.loaderBar.addChild(star);
            this.levelStarsArray.push(star);
        });

    }

    private updateStars(): void {
        let target = this.levelStarsArray[this.starsEarned];
        let startScale = target.scale.x;
        target.alpha = 1;
        let tl = gsap.timeline();
        tl.to(target.scale, 0.45,
            {
                // delay: 0.2,
                ease: "back.in",
                x: startScale * 1.6,
                y: startScale * 1.6,
                // onStart: () => {
                //     target.alpha = 1;
                // }
            }
        )
        tl.to(target.scale, 0.45,
            {
                ease: "back.out",
                x: startScale * 1.2,
                y: startScale * 1.2,
                // onStart: () => {
                //     target.alpha = 1;
                // }
            }
        )
        this.starsEarned++;
    }

    private particles(x: number, y: number, width: number, height: number) {

        let cfg = {
            "alpha": {
                "start": 1,
                "end": 0.15
            },
            "scale": {
                "start": 0.03,
                "end": 0.005
            },
            // "color": {
            //     "start": "#6c6c6c",
            //     "end": "#ababab"
            // },
            "speed": {
                "start": 0,
                "end": 0
            },
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "rotationSpeed": {
                "min": 0,
                "max": 360
            },
            "lifetime": {
                "min": 0.1,
                "max": 1.25
            },
            "blendMode": "normal",
            "frequency": 0.0005,
            "emitterLifetime": 0,
            "maxParticles": 75,
            "pos": {
                "x": width / -2.9,// App.width * 0.5,
                "y": height / 2.4,// App.height * 0.5
            },
            "addAtBack": false,
            "spawnType": "rect",
            "spawnRect": {
                "x": x,
                "y": y,
                "w": width,
                "h": height
            }
        }

        let container = new ParticleContainer;
        // this.addChild(container)
        this.addChildAt(container, 1)
        let starEmitter: Emitter = new Emitter(
            container,
            [Texture.from("star")],
            cfg
        );
        starEmitter.emit = true;
        this.emitters.push(starEmitter);
        gsap.delayedCall(0.15, () => {
            starEmitter.emit = false;
            gsap.delayedCall(2, () => {
                starEmitter.destroy();
                starEmitter.cleanup();
                starEmitter.update = (): void => { };
            });
        });
    }

    public update(time: number): void {
        this.emitters.forEach((emitter) => {
            if (emitter.parent) {
                emitter.update((time * 0.01))
            }
        });
    }
}
