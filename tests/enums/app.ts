// tests/enums/app.ts — tests TypeScript enum transpilation
enum Direction {
  Up,
  Down,
  Left = 10,
  Right,
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

const move = (dir: Direction): string => {
  if (dir === Direction.Up) return "Moving up";
  if (dir === Direction.Down) return "Moving down";
  if (dir === Direction.Left) return "Moving left";
  return "Moving right";
};

console.log("Enum Direction.Up:", Direction.Up);
console.log("Enum Direction.Left:", Direction.Left);
console.log("Enum Direction.Right:", Direction.Right);
console.log("Move Up:", move(Direction.Up));
console.log("Status.Active:", Status.Active);
