import * as Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { score: number; highScore: number }) {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d1d1d);

    this.add
      .text(width / 2, height * 0.28, 'GAME OVER', {
        fontSize: '42px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.4, `Score: ${data.score}`, {
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.47, `High Score: ${data.highScore}`, {
        fontSize: '24px',
        color: '#ffcc00',
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(width / 2, height * 0.62, 'RESTART', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#ff3366',
        padding: { x: 28, y: 14 },
      })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    const menuButton = this.add
      .text(width / 2, height * 0.73, 'MAIN MENU', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
