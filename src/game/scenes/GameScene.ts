import * as Phaser from 'phaser';
import { Player } from '../../objects/Player';
import { SwipeInput } from '../../systems/SwipeInput';
import { getLaneX, START_LANE } from '../../config/lanes';

type ObstacleType = 'solid' | 'single-hole' | 'double-hole';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private obstacles!: Phaser.GameObjects.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;
  private speed = 220;
  private spawnTimer = 0;
  private spawnEvery = 1300;
  private isGameOver = false;

  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;

    this.score = 0;
    this.speed = 220;
    this.isGameOver = false;

    this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb);

    this.drawLanes();

    this.player = new Player(this, getLaneX(START_LANE, width), height * 0.78);

    this.obstacles = this.add.group();

    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    new SwipeInput(this, {
      onLeft: () => this.player.moveLeft(width),
      onRight: () => this.player.moveRight(width),
      onUp: () => this.player.jump(),
    });

    this.input.keyboard?.on('keydown-LEFT', () => this.player.moveLeft(width));
    this.input.keyboard?.on('keydown-RIGHT', () =>
      this.player.moveRight(width),
    );
    this.input.keyboard?.on('keydown-UP', () => this.player.jump());
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return;

    this.spawnTimer += delta;

    if (this.spawnTimer >= this.spawnEvery) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    this.updateObstacles(delta);
  }

  private drawLanes() {
    const { width, height } = this.scale;

    for (let i = 1; i < 3; i++) {
      this.add.rectangle(
        (width / 3) * i,
        height / 2,
        3,
        height,
        0xffffff,
        0.25,
      );
    }
  }

  private spawnObstacle() {
    const random = Math.random();

    let type: ObstacleType;

    if (this.score < 3) {
      type = 'double-hole';
    } else if (random < 0.2) {
      type = 'solid';
    } else if (random < 0.75) {
      type = 'single-hole';
    } else {
      type = 'double-hole';
    }

    const safeLane = Phaser.Math.Between(0, 2);
    const blockedLane = Phaser.Math.Between(0, 2);

    if (type === 'solid') {
      this.createBlock(0, true);
      this.createBlock(1, true);
      this.createBlock(2, true);
      return;
    }

    if (type === 'single-hole') {
      for (let lane = 0; lane < 3; lane++) {
        if (lane !== safeLane) this.createBlock(lane, false);
      }
      return;
    }

    if (type === 'double-hole') {
      this.createBlock(blockedLane, false);
    }
  }

  private createBlock(lane: number, jumpable: boolean) {
    const { width } = this.scale;

    const x = getLaneX(lane, width);

    const block = this.add.rectangle(
      x,
      -40,
      width / 3 - 16,
      jumpable ? 28 : 70,
      jumpable ? 0xffcc00 : 0xff3366,
    );

    block.setData('jumpable', jumpable);
    block.setData('scored', false);

    this.physics.add.existing(block);
    const body = block.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    this.obstacles.add(block);
  }

  private updateObstacles(delta: number) {
    const { height } = this.scale;
    const moveAmount = (this.speed * delta) / 1000;

    this.obstacles.getChildren().forEach((child) => {
      const block = child as Phaser.GameObjects.Rectangle;
      block.y += moveAmount;

      const body = block.body as Phaser.Physics.Arcade.Body;
      body.updateFromGameObject();

      if (this.checkCollision(block)) {
        this.endGame();
      }

      if (!block.getData('scored') && block.y > this.player.y + 60) {
        block.setData('scored', true);
        this.addScore();
      }

      if (block.y > height + 100) {
        block.destroy();
      }
    });
  }

  private checkCollision(block: Phaser.GameObjects.Rectangle): boolean {
    const playerBounds = this.player.getBounds();
    const blockBounds = block.getBounds();

    const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
      playerBounds,
      blockBounds,
    );

    if (!isOverlapping) return false;

    const isJumpable = block.getData('jumpable');

    if (isJumpable && this.player.isJumping) {
      return false;
    }

    return true;
  }

  private addScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);

    this.speed = Math.min(420, 220 + this.score * 8);
  }

  private endGame() {
    this.isGameOver = true;

    const highScore = Number(localStorage.getItem('mimeoHighScore') || 0);

    if (this.score > highScore) {
      localStorage.setItem('mimeoHighScore', String(this.score));
    }

    this.scene.start('GameOverScene', {
      score: this.score,
      highScore: Math.max(this.score, highScore),
    });
  }
}
