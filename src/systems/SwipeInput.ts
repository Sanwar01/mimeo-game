type SwipeCallbacks = {
  onLeft: () => void;
  onRight: () => void;
  onUp: () => void;
};

export class SwipeInput {
  private startX = 0;
  private startY = 0;
  private minDistance = 40;

  constructor(scene: Phaser.Scene, callbacks: SwipeCallbacks) {
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startX = pointer.x;
      this.startY = pointer.y;
    });

    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const diffX = pointer.x - this.startX;
      const diffY = pointer.y - this.startY;

      if (
        Math.abs(diffX) < this.minDistance &&
        Math.abs(diffY) < this.minDistance
      ) {
        return;
      }

      if (Math.abs(diffX) > Math.abs(diffY)) {
        diffX > 0 ? callbacks.onRight() : callbacks.onLeft();
      } else {
        if (diffY < 0) callbacks.onUp();
      }
    });
  }
}
