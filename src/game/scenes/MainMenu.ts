import * as Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.28, 'MIMEO', {
        fontSize: '56px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.42, 'Swipe. Jump. Survive.', {
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(width / 2, height * 0.58, 'PLAY', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#222222',
        padding: { x: 32, y: 16 },
      })
      .setOrigin(0.5)
      .setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
