import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { config } from "../../MainGameConfig";

export class Card extends Container {

    public card: Sprite;
    public state: string = "hidden";
    public type: string = "";
    public isOpen: boolean = false;

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
        // this.type = type;
        let startScale = this.card.scale.x;
        let startedFlippling = false;

        let flipTween = gsap.to(this.card.scale, config.cardFlipDuration,
            {
                x: startScale * -1,
                ease: "linear",
                onUpdate: () => {
                    if (flipTween.progress() > 0.4 && !startedFlippling) {
                        startedFlippling = true;
                        this.card.texture = Texture.from(this.state === "hidden" ? "cardBack" : this.type);
                    }
                },
                onComplete: () => { },
            }
        );
    }

    public playCelebration(): void {
        let w = this.card.width;
        let h = this.card.height;
        let tl = gsap.timeline();
        tl.to(this.card, 0.15,
            {
                ease: "back.inOut",
                width: w * 1.1,
                height: h * 1.1
            }
        )
        tl.to(this.card, 0.4,
            {
                ease: "back.inOut",
                // delay:0.3,
                width: 0,
                height: 0
            }
        )
    }
}
