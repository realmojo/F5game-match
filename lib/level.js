let stage = [];
for (let i = 0; i < 5; i++) {
  stage.push({
    level: i + 1,
    row: 2,
    col: 2,
    time: 10 - i + 10,
  });
}

for (let i = 5; i <= 1000; i++) {
  let col = 0;
  if (i >= 5 && i < 10) {
    col = 2;
  } else if (i >= 10 && i < 20) {
    col = 3;
  } else if (i >= 20 && i < 30) {
    col = 4;
  } else if (i >= 30 && i < 40) {
    col = 5;
  } else if (i >= 50) {
    col = 6;
  }
  stage.push({
    level: i + 1,
    row: 6,
    col: col,
    time: 30,
  });
}

export const levels = [...stage];
