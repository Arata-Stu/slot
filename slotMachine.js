class Arm {
    constructor(mean) {
        this.mean = mean; // このアームの平均報酬値
    }

    // 正規分布に従う乱数を生成する関数（標準偏差は1とする）
    getRandomReward() {
        return this.mean + Bandit.randomNormal();
    }
}

class Bandit {
    constructor(numArms) {
        this.arms = [];
        // 各アームにランダムな平均報酬値（qstar）を設定
        for (let i = 0; i < numArms; i++) {
            this.arms.push(new Arm(Bandit.randomNormal()));
        }
    }

    pullArm(index) {
        return this.arms[index].getRandomReward();
    }

    // Box-Muller変換を用いた標準正規分布乱数生成関数
    static randomNormal() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // 0を除外
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}

class EpsilonGreedyPlayer {
    constructor(numArms, epsilon = 0.1) {
        this.bandit = new Bandit(numArms);
        this.numArms = numArms;
        this.epsilon = epsilon;
        this.totalRewards = new Array(numArms).fill(0);
        this.counts = new Array(numArms).fill(0);
        this.qValues = new Array(numArms).fill(0); // 各アームのq値
    }

    // 1回プレイする
    play() {
        let chosenArm;
        if (Math.random() < this.epsilon) {
            // 確率εでランダムにアームを選択
            chosenArm = Math.floor(Math.random() * this.numArms);
        } else {
            // それ以外の場合、現時点で最高のq値を持つアームを選択
            chosenArm = this.qValues.indexOf(Math.max(...this.qValues));
        }

        // 選択したアームを引いて報酬を受け取る
        let reward = this.bandit.pullArm(chosenArm);
        this.counts[chosenArm]++;
        this.totalRewards[chosenArm] += reward;

        // q値を更新
        this.qValues[chosenArm] = this.totalRewards[chosenArm] / this.counts[chosenArm];

        return { chosenArm, reward };
    }

    // 指定された回数プレイする
    playFor(play_n) {
        let results = [];
        for (let i = 0; i < play_n; i++) {
            results.push(this.play());
        }
        return results;
    }
}

// JavaScriptコード
function startSimulation() {
    const numBandits = parseInt(document.getElementById('numBandits').value);
    const epsilon = parseFloat(document.getElementById('epsilonValue').value);
    const numPlays = parseInt(document.getElementById('numPlays').value);

    let allRewards = [];

    for (let i = 0; i < numBandits; i++) {
        let player = new EpsilonGreedyPlayer(10, epsilon);
        let rewards = [];
        let totalReward = 0;

        for (let j = 0; j < numPlays; j++) {
            let result = player.play();
            totalReward += result.reward;
            rewards.push(totalReward / (j + 1)); // 平均報酬
        }

        allRewards.push(rewards);
    }

    plotResults(allRewards, numPlays);
}

function plotResults(allRewards, numPlays) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const labels = Array.from({ length: numPlays }, (_, i) => i + 1);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: allRewards.map((rewards, index) => ({
                label: `バンディット ${index + 1}`,
                data: rewards,
                fill: false,
                borderColor: `hsl(${index * 360 / allRewards.length}, 100%, 50%)`,
                tension: 0.1
            }))
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}