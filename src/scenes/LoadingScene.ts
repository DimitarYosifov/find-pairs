import { Container, Graphics, Loader, Text, TextStyle } from "pixi.js";
import { assets } from "../Assets";
import { IScene, App } from "../App";
import gsap from "gsap";
import { config } from "../MainGameConfig";
import { Level } from "./Level";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

 export class LoadingScene extends Container implements IScene {

    private loaderBar: Container = new Container;
    private textsContainer: Container = new Container;
    private loaderBarBorder: Graphics = new Graphics;
    private loaderBarFill: Graphics = new Graphics;
    private loadingText: Text;
    private loadingValue: Text;

    constructor() {
        super();

        Loader.registerPlugin(WebfontLoaderPlugin);
        Loader.shared.add(assets);
        Loader.shared.add({ name: "Risque-Regular", url: 'fonts/Risque-Regular.ttf' });

        Loader.shared.onProgress.add(this.downloadProgress, this);
        Loader.shared.onComplete.once(this.gameLoaded, this);
        Loader.shared.load();


        console.log(Loader.shared);
        

        this.loadBarGraphics();
        this.loadingTexts();
    }

    private loadBarGraphics() {
        const loaderBarWidth = App.width * 0.7;

        this.loaderBarFill.beginFill(0x5a5a5a, 1)
        this.loaderBarFill.drawRoundedRect(0, 0, loaderBarWidth, 10, 11);
        this.loaderBarFill.endFill();

        this.loaderBarBorder.beginFill(0xedef4e, 1);// yellow
        this.loaderBarBorder.drawRoundedRect(0, 0, App.width * 0.7, 10, 11);

        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBorder);
        this.loaderBar.position.x = (App.width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (App.height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);
    }

    private loadingTexts() {
        const style: TextStyle = new TextStyle({
            fontFamily: config.mainFont,
            fontSize: 35,
            fill: '#000000',
            align: 'center',
            stroke: '#dbb7b7',
            fontWeight: "800",
            strokeThickness: 3
        });
        this.loadingText = new Text('LOADING...', style);
        this.loadingText.anchor.set(0.5, 0)
        this.loadingText.position.set(App.width / 2, 420)
        this.textsContainer.addChild(this.loadingText);

        this.loadingValue = new Text('0%', style);
        this.loadingValue.anchor.set(0.5, 0)
        this.loadingValue.position.set(App.width / 2, 485)
        this.textsContainer.addChild(this.loadingValue);
        this.addChild(this.textsContainer);
    }

    private downloadProgress(loader: Loader): void {
        const progressRatio = loader.progress / 100;
        this.loaderBarBorder.width = App.width * 0.7 * progressRatio;
        this.loadingValue.text = `${Math.ceil(progressRatio * 100)}%`;
    }

    private gameLoaded(): void {
        /** 
         *   determine which scene to show: login/register, standigs view or mode selection
         */
        App.removeScene(this);
        gsap.delayedCall(0.01, () => {
            App.fade(0, 1).then(() => { 
                App.setScene(new Level())
            });
        })
    }

    public update(framesPassed: number): void { };

    public addBG() { };
}
