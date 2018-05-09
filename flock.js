class Flock {
    /**
     * 
     * @param {value} num number of agents
     */
    constructor(num) {
        this.debug = false;
        this.agents = [];
        for (let i = 0; i < num; i++) {
            this.agents.push(new Agent(random(100, width - 100), random(100, height - 100), 0));
        }
        for (let agent of this.agents) {
            agent.setFriendAndEnemy(this.agents);
        }
    }
    /**
     * show the agents
     */
    show() {
        for (let agent of this.agents) {
            if(this.debug)agent.debug();
            agent.show();
        }
    }
    /**
     * update the agents
     */
    update() {
        for (let agent of this.agents) {
            agent.applyBehaviors(this.agents);
            agent.update();
        }
    }
    setForce(val){
        for (let agent of this.agents)agent.force = val;
    }
    setSpeed(val){
        for (let agent of this.agents)agent.speed = val;
        console.log(val);
    }
    setDebug(){
        this.debug = !this.debug
    }
    setAllCowards() {
        for (let agent of this.agents) agent.behaviour = 0;
    }
    setAllHeroes() {
        for (let agent of this.agents) agent.behaviour = 1;
    }
    setTriangle(){
        for (let agent of this.agents) agent.behaviour = 2;
    }
    setRandomSeed(val) {
        for (let agent of this.agents) {
            random(100) < val ? agent.behaviour = 1 : agent.behaviour = 0;
            // let val = floor(random(2));
            // agent.behaviour = val;
        }
    }
}