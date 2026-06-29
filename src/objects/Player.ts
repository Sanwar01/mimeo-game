import * as Phaser from 'phaser';
import { getLaneX, START_LANE } from '../config/lanes';

export class Player extends Phaser.GameObjects.Arc {
  currentLane = START_LANE;
  isJumping = false;

  private jumpDuration = 450;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 26, 0, 360, false, 0xffffff);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(26);
    body.setCollideWorldBounds(true);
  }

  moveLeft(screenWidth: number) {
    if (this.currentLane <= 0) return;
    this.currentLane -= 1;
    this.moveToLane(screenWidth);
  }

  moveRight(screenWidth: number) {
    if (this.currentLane >= 2) return;
    this.currentLane += 1;
    this.moveToLane(screenWidth);
  }

  jump() {
    if (this.isJumping) return;

    this.isJumping = true;

    this.scene.tweens.add({
      targets: this,
      scale: 1.35,
      duration: this.jumpDuration / 2,
      yoyo: true,
      onComplete: () => {
        this.isJumping = false;
      },
    });
  }

  private moveToLane(screenWidth: number) {
    const targetX = getLaneX(this.currentLane, screenWidth);

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: 130,
      ease: 'Sine.easeOut',
    });
  }
}
