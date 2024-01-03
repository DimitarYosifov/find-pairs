import { App } from "./App";
import { Text } from "pixi.js";
import gsap from "gsap";

export default class BangUp {
    constructor(target: Text, duration: number, startVal: number, endVal: number, delay = 0, onStart = null, onUpdate = null, onComplete = null) {
        let tween = gsap.to(target, duration,
            {
                delay: delay,
                onStart: () => {
                    target.text = startVal.toString();
                },
                onUpdate: () => {
                    let currentValue = +startVal + ((endVal - +startVal) * tween.progress());
                    target.text = Math.ceil(currentValue).toString();
                },
                onComplete: () => {
                    target.text = endVal.toString();
                }
            }
        );
    }
}
