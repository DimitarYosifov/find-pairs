import { Container, Text, TextStyle } from "pixi.js";

export function createText(_text: string, style: TextStyle, parent: Container, y: number, x: number, anchorX: number, anchorY: number, fontSize: number) {
    let text = new Text(_text, style);
    text.anchor.set(anchorX, anchorY);
    text.style.fontSize = Math.ceil(fontSize);
    text.position.set(x, y);
    parent.addChild(text);
    return text;
}
