import { App } from './App';
import { LoadingScene } from './scenes/loading/LoadingScene';
import './css/style';

window.onload = () => {
    document.querySelector("body")!.style.display = "block";
    App.initialize(540, 960, 0x000000);
    const loading: LoadingScene = new LoadingScene();
    App.setScene(loading);
}

/**
 * enable pixi dev-tool for chrome...
 * https://github.com/bfanger/pixi-inspector/issues/42
 */
import * as PIXI from 'pixi.js';
(() => {
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
        (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__
            .register({ PIXI: PIXI });
})();
