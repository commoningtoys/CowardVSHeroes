class Flock {
    /**
     * 
     * @param {value} num number of agents
     */
    constructor(num, behaviour) {
        this.debug = true;
        this.agents = [];
        for (let i = 0; i < num; i++) {
            this.agents.push(new Agent(random(100, width - 100), random(100, height - 100), behaviour));
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
            if (this.debug) agent.debug();
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
    setForce(val) {
        for (let agent of this.agents) agent.force = val;
    }
    setSpeed(val) {
        for (let agent of this.agents) agent.speed = val;
        console.log(val);
    }
    setDebug() {
        this.debug = !this.debug
    }
    setAllCowards() {
        for (let agent of this.agents) agent.behaviour = 0;
        updateMenu()
    }
    setAllHeroes() {
        for (let agent of this.agents) agent.behaviour = 1;
        updateMenu()
    }
    setTriangle() {
        for (let agent of this.agents) agent.behaviour = 2;
    }
    randomize() {
        for (const agent of this.agents) {
            const behaviour = floor(random(3));
            agent.behaviour = BEHAVIOURS[behaviour];
        }
    }
    setRandomSeed(val) {
        let len = this.agents.length;

        for (let agent of this.agents) {
            random(100) < val ? agent.behaviour = 1 : agent.behaviour = 0;
        }
    }
    setAgents(agents_behaviours) {
        console.log('working')
        const len = agents_behaviours.length;
        if (len < this.agents.length) {
            for (let i = 0; i < len; i++) {
                this.agents[i].behaviour = agents_behaviours[i];
                
            }
            const diff = this.agents.length - len;
            this.agents.splice(len, diff);
        } else {
            for (let i = 0; i < len; i++) {
                this.agents[i].behaviour = agents_behaviours[i];
            }

        }
    }
    getAgentsNumber() {
        let heroesAgent = 0;
        let cowardsAgent = 0;
        let triangleAgent = 0;
        for (let agent of this.agents) {
            if (agent.behaviour === BEHAVIOURS[0]) {
                //count cowards
                cowardsAgent++;
            } else if (agent.behaviour === BEHAVIOURS[1]) {
                //count Heores
                heroesAgent++;
            } else if (agent.behaviour === BEHAVIOURS[2]) {
                triangleAgent++;
            }
        }
        return {
            heroes: heroesAgent,
            cowards: cowardsAgent,
            triangle: triangleAgent
        };
    }
}