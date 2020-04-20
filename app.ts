/// <reference path="lib/phaser.d.ts" />
/// <reference path="lib/mqttws31.d.ts" />

class HelloWorld extends Phaser.Scene {
    private client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "phaser-prototype");

    constructor() {
        super("Hello World");
        this.client.connect({
            userName: 'sdi42',
            password: '495450f1c928f0828926047ad396d5ac',
            keepAliveInterval: 30,
            cleanSession: true
        });
    }

    preload() {
        this.load.image('logo', 'assets/logo.png');
        this.load.glsl('starfield', 'assets/starfields.glsl.js');
    }

    create() {
        this.add.shader('RGB Shift Field', 0, 0, 640, 320).setOrigin(0);
        const logo = this.add.image(320, 210, 'logo');

        this.tweens.add({
            targets: logo,
            y: 100,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });

        this.game.events.on('postrender', () => {
            if (this.client.isConnected()) {
                this.game.renderer.snapshot((image: HTMLImageElement) => {
                    const data = image.src.replace(/^data:image\/png;base64,/, "");
                    this.client.send("sdi42/VirtualGamePad/LCD/PNG", data);
                })
            }
        });
    }
}

window.onload = () => {
    new Phaser.Game({
        type: Phaser.AUTO,
        width: 640,
        height: 320,
        scene: HelloWorld
    });
};
