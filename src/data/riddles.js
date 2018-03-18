export const riddles = [
  {
    frames: [
      {from: {pos: [1, 1], color: [10, 20, 30]}, split: 3, to: {color: [100, 60, 80]}},
      {from: {pos: [1, 2], color: [80, 20, 30]}, split: 3, to: {color: [120, 60, 100]}},
      {from: {pos: [1, 3], color: [100, 1,  1]}, split: 3, to: {color: [180, 90, 90]}},
      {from: {pos: [1, 4], color: [320,10,30]}, split: 3, to: {color: [ 100,10,80 ]}},
      {from: {pos: [1, 5], color: [200,10,30]}, split: 3, to: {color: [ 200,60,30]}},
    ],
    // cues: [ 3, 6, 8, 16 ]
    cuePosList: [
      [1, 2],
      [2, 1],
      [4, 3],
      [4, 1],
    ]
  },
  {
    frames: [
      {from: {pos: [0, 1], color: 'HSL(0, 26%, 41%)'}, split: 1, to: {color: 'HSL(47, 60%, 30%)'}},
      // {from: {pos: [0, 1], color: 'HSL(0, 26%, 41%)'}, split: 1, to: {color: 'HSL(105, 9%, 73%)'}, direction: 'Down'},
      // {from: {pos: [0, 3], color: 'HSL(105, 9%, 73%)'}, split: 2, to: {color: 'HSL(160, 100%, 33%)'}},
    ],
    cuePosList: [
      [0, 1],
    ]
  },
]
