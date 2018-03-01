class Agent {
    /**
     * agent constructor
     * @param {float} x pos on the x axis
     * @param {float} y pos on y axis
     * @param {binary} behaviour tells if the agent is either a coward or a hero
     */
    constructor(x, y, behaviour) {
        let posX = random(width);
        this.pos = createVector(x, y),
            this.r = 15, this.speed = 2, this.force = 0.7,
            this.target = createVector(x, y),
            this.vel = createVector(),
            this.acc = createVector(),
            this.debug = createVector(),
            this.friend, this.enemy,
            this.behaviour = behaviour;
    }
    /**
     * show the agent as circle
     */
    show() {
        fill(255);
        stroke(0, 255, 0);
        let theta = this.vel.heading() + PI/2; //add it later to see the direction of the agent
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta)
        line(0, 0, 10, 10);
        ellipse(0, 0, this.r);
        pop();
        stroke(0, 255, 0);
        // line(this.pos.x, this.pos.y, this.friend.pos.x, this.friend.pos.y);
        stroke(255, 0, 0);
        // line(this.pos.x, this.pos.y, this.enemy.pos.x, this.enemy.pos.y);
        fill(255, 255, 0);
        stroke(255, 0, 255);
        line(this.friend.pos.x, this.friend.pos.y, this.enemy.pos.x, this.enemy.pos.y)

        stroke(0, 255, 255);
        line(this.pos.x, this.pos.y, this.debug.x, this.debug.y)
        ellipse(this.debug.x, this.debug.y, 10);
    }
    /**
     * update the agent position according to vector math
     */
    update() {
        // Update this.velocity
        this.vel.add(this.acc);
        // Limit this.speed
        this.vel.limit(this.speed);
        this.pos.add(this.vel);
        // Reset accelertion to 0 each cycle
        this.acc.mult(0);
        this.target = this.setTarget(this.behaviour);
        // this.setTarget(this.behaviour);
    }
    /**
     * Sets the enemy and the friend of an agent
     * @param {Array} flock Array of agents
     */
    setFriendAndEnemy(flock) {
        // the agent looks for a friend and an enemy.
        // the enemy and the friend can't be the same agent
        // also need to exclude the agent himself
        // let's search for friends
        while (true) {
            let randomIndex = floor(random(flock.length));
            if (flock[randomIndex] !== this) {
                this.friend = flock[randomIndex];
                break;
            }
        }
        // we do the same searching for the enemy
        while (true) {
            let randomIndex = floor(random(flock.length));
            if (flock[randomIndex] !== this && flock[randomIndex] !== this.friend) {
                this.enemy = flock[randomIndex];
                break;
            }
        }
    }
    setTarget(behaviour) {
        if (behaviour > 0) {
            let sum = p5.Vector.add(this.friend.pos, this.enemy.pos);
            this.debug = sum.div(2);
        } else {
            let radius = 50;
            // Our Formula
            // x = x1 + t * dx
            // y = y1 + t * dy
            // dx = x2 - x1;
            // dy = y2 - y1;
            let v1 = this.enemy.pos;
            let v2 = this.friend.pos
            let dx = v2.x - v1.x;
            let dy = v2.y - v1.y;
            let distance = p5.Vector.dist(v1, v2);
            //normalization
            dx /= distance;
            dy /= distance;
            let x = v1.x - radius * dx;
            let y = v1.y - radius * dy;
            this.debug = createVector(x, y);
        }
        return this.debug;
    }
    /**
     * set a new this.target for the agent
     * @param {PVector} p - vector element of the this.pos to reach
     */
    settarget(p) {
        this.target = p;
        // this.target.add(p);
    }
    /**
     * returns the radius of the agent
     */
    getRadius() {
        return this.r;
    }
    //returns if the agent has reached his this.target
    targetReached() {
        let d = p5.Vector.dist(this.pos, this.target);
        return (d < 1);
    }
    // applyForce(force) {
    //     // We could add mass here if we want A = F / M
    //     this.acc.add(force);
    // }
    /**
     * The functions below are from Nature of Code
     * Separation and Seek by Daniel Shiffman
     * http://natureofcode.com
     */
    applyBehaviors(agents) {
        let separateForce = this.separate(agents);
        let seekForce = this.seek(this.target);
        separateForce.mult(2.0);
        seekForce.mult(1.5);
        this.acc.add(separateForce);
        this.acc.add(seekForce);
        // applyForce(separateForce);
        // applyForce(seekForce);
    }
    // Separation
    // Method checks for nearby Agents and steers away
    separate(Agents) {
        let desiredseparation = this.r * 1.2;
        let sum = createVector();
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let other of Agents) {
            let d = p5.Vector.dist(this.pos, other.pos);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.pos, other.pos);
                diff.normalize();
                diff.div(d);        // Weight by distance
                sum.add(diff);
                count++;            // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count);
            // Our desired vector is the average scaled to maximum this.speed
            sum.normalize();
            sum.mult(this.speed);
            // Implement Reynolds: Steering = Desired - this.vel
            sum.sub(this.vel);
            sum.limit(this.force);
        }
        return sum;
    }

    // A method that calculates a steering this.force towards a this.target
    // STEER = DESIRED MINUS this.vel
    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);  // A vector pointing from the this.pos to the this.target
        // Normalize desired and scale to maximum this.speed
        desired.normalize();
        desired.mult(this.speed);
        // Steering = Desired minus this.vel
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.force);  // Limit to maximum steering this.force

        return steer;
    }
}

