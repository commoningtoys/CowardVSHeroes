let counter = 0;
class Flock {

    constructor(num) {
        this.mouse = createVector();
        this.agents = [];
        for (let i = 0; i < num; i++) {
            this.agents.push(new Agent(random(100, width - 100), random(100, height - 100), floor(random(2))));
        }
        for (let agent of this.agents) {
            agent.setFriendAndEnemy(this.agents);
        }
    }
    show() {
        for (let agent of this.agents) {
            agent.show();
        }
    }
    update() {
        for (let agent of this.agents) {
            agent.applyBehaviors(this.agents);
            agent.update();
        }
    }
}