import { observable, runInAction } from "mobx";
import { levels } from "../lib";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loadImage = [
  require("../assets/images/0.png"),
  require("../assets/images/1.png"),
  require("../assets/images/2.png"),
  require("../assets/images/3.png"),
  require("../assets/images/4.png"),
  require("../assets/images/5.png"),
  require("../assets/images/6.png"),
  require("../assets/images/7.png"),
  require("../assets/images/8.png"),
  require("../assets/images/9.png"),
  require("../assets/images/10.png"),
  require("../assets/images/11.png"),
  require("../assets/images/12.png"),
  require("../assets/images/13.png"),
  require("../assets/images/14.png"),
  require("../assets/images/15.png"),
  require("../assets/images/16.png"),
  require("../assets/images/17.png"),
  require("../assets/images/18.png"),
  require("../assets/images/19.png"),
  require("../assets/images/20.png"),
  require("../assets/images/21.png"),
  require("../assets/images/22.png"),
  require("../assets/images/23.png"),
  require("../assets/images/24.png"),
];

const doGetLevel = () => {
  return new Promise(async (resolve) => {
    const level = await AsyncStorage.getItem("level");
    resolve(level ? Number(level) : 1);
  });
};

const doGetScore = () => {
  return new Promise(async (resolve) => {
    const score = await AsyncStorage.getItem("score");
    resolve(score ? JSON.parse(score) : []);
  });
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getRandomNumber = (min, max) => {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
};

const getImage = (items) => {
  let imageItems = [];
  const len = items.length / 2;
  while (imageItems.length !== len) {
    const randomNumber = getRandomNumber(0, 25);
    if (!imageItems.includes(randomNumber)) {
      imageItems.push(randomNumber);
    }
  }

  return imageItems;
};

const game = observable({
  items: [],
  times: 0,
  isVibration: true,

  getLevel: async () => {
    const level = await doGetLevel();
    return level ? level : 1;
  },

  getStage: async () => {
    const level = await doGetLevel();
    return levels[level - 1];
  },

  async setLevel(level) {
    await AsyncStorage.setItem("level", `${level}`);
  },

  setActive(key, active) {
    this.items[key].active = active;
  },

  setVibration() {
    this.isVibration = !this.isVibration;
  },

  setActiveClose() {
    for (const i in this.items) {
      this.items[i].active = false;
    }
  },

  setNumber(key, number) {
    this.items[key].number = number;
  },

  setItems(level) {
    let t = [];

    const stage = levels[level - 1];
    const len = stage.row * stage.col;
    for (let i = 0; i < len; i += 1) {
      t.push({
        id: i,
        image: require("../assets/favicon.png"),
        active: false,
        number: 0,
      });
    }
    this.items = t;
  },

  async setImageAndShuffle() {
    const level = await doGetLevel();
    this.setItems(level);

    runInAction(() => {
      const randomImageItems = getImage(this.items);
      const length = this.items.length;
      let j = 0;
      for (let i = 0; i < length; i++) {
        this.items[i].image = loadImage[randomImageItems[j]];
        this.setNumber(i, randomImageItems[j]);
        this.items[i].active = true;
        j++;
        if (randomImageItems.length - 1 === i) {
          j = 0;
        }
      }
      this.items = shuffle(this.items);
    });
  },

  getItems() {
    this.setImageAndShuffle();
    return this.items;
  },

  isClear() {
    const e = this.items.filter((item) => item.active === false);
    return e.length === 0 ? true : false;
  },

  async initScore() {
    await AsyncStorage.setItem("score", JSON.stringify([]));
  },

  async setScore(level, time) {
    let score = await doGetScore();
    score.push({
      level,
      time,
    });
    await AsyncStorage.setItem("score", JSON.stringify(score));
  },

  async getScore() {
    const score = await doGetScore();
    return score;
  },
});

export default game;
