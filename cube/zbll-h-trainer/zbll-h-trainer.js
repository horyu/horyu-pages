"use strict";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

class ConfigMaker {
  constructor() {
    this.halgs = {
      tate1: [
        "R U' L U R' U2 L' U L U L' U' L U L'",
        "L' U R' U' L U2 R U' R' U' R U R' U' R",
        "R U R' U R U2 R' F R U' R' U' R U2 R' U' F'",
        "R2 D R' U2 R D' R U' R2 U' R2 U2 R",
        "L2 D' L U2 L' D L' U L2 U L2 U2 L'",
        "L' U' L U' L' U' R U' L U R'",
        "R U R' U R U L' U R' U' L",
        "L U L' U L' U' L2 U' L2 U' R U' L U R'",
        "R' U' R U' R U R2 U R2 U L' U R' U' L",
        "R U' L' U R2 U' R L U2 R' U' R",
        "L' U R U' L2 U L' R' U2 L U L'",
        "D R' U' R D' R U' R' U2 R U2 R U R U' R2",
      ],
      tate2: [
        "B' R U' R' U2 R2 U R' U2 R U R2 U' B",
        "B L' U L U2 L2 U' L U2 L' U' L2 U B'",
        "x' U' R U' R' U R' F2 R U' R U R' U x",
        "R2 F R F' R' U2 R' U2 R U2 x' U' R2 U R",
        "L2 F' L' F L U2 L U2 L' U2 x' U L2 U' L'",
        "R U' R2 U' F2 U' R2 U R2 U F2 R2 U R'",
        "F R U R' U' R U R' U' R U R' U' F'",
        "L' U L2 U F2 U L2 U' L2 U' F2 L2 U' L",
      ],
      yoko1: [
        "x' M' U' R U' R' U R U2 L' U R' U2 R",
        "x' M' U L' U L U' L' U2 R U' L U2 L'",
        "F R U R' U' R' F' U2 R U R' U R2 U2 R'",
        "R U2 R' U' R U' R D' R U' R' D R U R",
        "L' U2 L U L' U L' D L' U L D' L' U' L'",
        "R U' L2 D' L U2 L' D L U' R' U' L",
        "L' U R2 D R' U2 R D' R' U L U R'",
        "F' B L2 B' L2 U L2 U L2 U' L2 F ",
        "F B' R2 B R2 U' R2 U' R2 U R2 F'",
        "F R U' R' U R U2 R' U' R U R' U' F'",
        "F' U L' U2 L U2 L' U L U L' U' L U' F",
        "F U' R U2 R' U2 R U' R' U' R U R' U F'",
      ],
      yoko2: [
        "R U R' U R U' R' U R U2 R'",
        "L' U' L U' L' U L U' L' U2 L",
        "L' U2 L U L' U' L U L' U L",
        "R U2 R' U' R U R' U' R U' R'",
        "R' U2 R U R' U R U R U R' U R U2 R'",
        "L U2 L' U' L U' L' U' L' U' L U' L' U2 L",
        "R U R' U R U2 R' U' R' U2 R U R' U R",
        "R U R2 U' R2 U' R U2 R U2 R U' R2 U' R2 U R",
      ],
    };
    this.targets = [];
    this.cn;
  }
  config() {
    this.targets = [];
    for (const input of document.getElementsByClassName('config-alg')) {
      if (input.checked) {
        this.targets = this.targets.concat(this.halgs[input.id]);
      }
    }
    this.cn = document.getElementById('cn').checked;
  }
  make() {
    const auf = ["", "U ", "U2 ", "U' "][getRandomInt(4)];
    const alg = this.targets[getRandomInt(this.targets.length)] || '';
    let conf = `alg=${auf + alg}|colored=U*|hover=none`;
    if (this.cn) {
      conf += this._colors();
    }
    return conf;
  }
  _colors() {
    const c = { F: 'b', B: 'g', U: 'r', D: 'o', R: 'w', L: 'y' };
    [
      // x' : M 回転
      () => { [c.U, c.F, c.D, c.B] = [c.B, c.U, c.F, c.D]; },
      // y' : E 回転
      () => { [c.F, c.R, c.B, c.L] = [c.L, c.F, c.R, c.B]; },
      // z' : S 回転
      () => { [c.U, c.R, c.D, c.L] = [c.L, c.U, c.R, c.D]; },
    ].forEach(func => {
      const n = getRandomInt(4);
      for (let i=0; i<n; i++) {
        func();
      }
    });
    const colors = Object.entries(c).map(([k, v]) => `${k}:${v}` ).join(' ');
    return `|colors=${colors}`;
  }
}
const cm = new ConfigMaker;
cm.config();

const scramble = () => {
  if (CubeAnimation.webgl_cubes >= 16) {
    location.reload();
  }
  Object.entries(CubeAnimation.by_id).forEach(([_, v]) => v.remove());
  // class="roofpig" がないと、アニメーションや諸々の機能がなくなる
  CubeAnimation.create_in_dom('#sunaba', cm.make(), 'class="roofpig"');
}

Array.from(document.getElementsByClassName('config')).forEach(input => {
  // bindしないと、thisが input になる
  input.addEventListener('change', cm.config.bind(cm));
});
document.getElementById('scramble').addEventListener('click', scramble);

// keyboardイベントはCubeAnimetionに持っていかれる
// document.addEventListener('keydown', e => {
//   console.log(e.keyCode);
// }, false);

// deferで読み込まれるが、即実行するとエラー画面が出るので適当に時間を置く
setTimeout(scramble, 50);
