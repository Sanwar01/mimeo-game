export const LANE_COUNT = 3;

export const getLaneX = (lane: number, screenWidth: number): number => {
  const laneWidth = screenWidth / LANE_COUNT;
  return laneWidth * lane + laneWidth / 2;
};

export const START_LANE = 1;
