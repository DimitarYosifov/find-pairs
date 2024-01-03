import { IScene, App } from "../App";
import { Container, Sprite, Graphics, Loader, Text, TextStyle, Texture, ParticleContainer } from "pixi.js";
import { Emitter, EmitterConfig } from "pixi-particles";
import gsap from "gsap";

export class Card extends Container {

    public card: Sprite;
    public state: string = "hidden";

    constructor() {
        super();
        this.create();
        this.addInteractivity();
    }

    private create(): void {
        this.card = Sprite.from("cardBack");
        this.card.anchor.set(0.5);
        this.card.scale.set(0.25);
        this.addChild(this.card);
    }

    private addInteractivity(): void {
        this.card.interactive = true;
        this.card.buttonMode = true;
    }

    public flip(): void {
        let startScale = this.card.scale.x;
        let startedFlippling = false;

        let flipTween = gsap.to(this.card.scale, 0.2,
            {
                x: startScale * -1,
                ease: "linear",
                onUpdate: () => {
                    if (flipTween.progress() > 0.4 && !startedFlippling) {
                        startedFlippling = true;
                        this.card.texture = Texture.from( this.state === "hidden" ? "cardBack" : "ace");
                    }
                },
                onComplete: () => { },
            }
        );
    }
}
