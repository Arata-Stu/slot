class Arm {
    constructor(mean, stdDev) {
        this.mean = mean;
        this.stdDev = stdDev;
    }

    // 正規分布に従う乱数を生成する
    getRandomReward() {
        let u1 = 0;
        let u2 = 0;
        // 0を除外する
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        
        let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return this.mean + this.stdDev * randStdNormal;
    }
}

class Bandit {
    constructor(numArms) {
        this.arms = [];
        // 各アームにランダムな平均と標準偏差を設定
        for (let i = 0; i < numArms; i++) {
            let mean = Math.random() * 10; // 例: 0から10の範囲で平均値
            let stdDev = Math.random() * 5; // 例: 0から5の範囲で標準偏差
            this.arms.push(new Arm(mean, stdDev));
        }
    }

    pullArm(index) {
        return this.arms[index].getRandomReward();
    }
}

// 10本アームのバンディットを生成
let myBandit = new Bandit(10);

// テスト：第1アームを引く
console.log(myBandit.pullArm(0));
