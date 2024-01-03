// import { Container, Sprite } from "pixi.js";
// import { IScene, App } from "../App";
// import gsap from "gsap";
// import { ServerRequest } from "../ServerRequest"


// export class GameScene extends Container implements IScene {
//     private clampy: Sprite;
//     constructor() {
//         super();

//         ServerRequest("getAllClubsData").then((res) => console.log(res));
//         this.clampy = Sprite.from("red_card");

//         this.clampy.anchor.set(0.5);
//         this.clampy.x = 0;
//         this.clampy.y = App.height / 2;
//         this.addChild(this.clampy);

//         gsap.to(this.clampy, 4, {
//             x: App.width * 1,
//             yoyo: true,
//             repeat: -1
//         })
//     }
//     public update(framesPassed: number): void {
//         framesPassed = framesPassed;
//     }
//     public addBG(){};
// }
