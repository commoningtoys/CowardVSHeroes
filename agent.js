class Agent {
    /**
     * agent constructor
     * @param {Number} x pos on the x axis
     * @param {Number} y pos on y axis
     * @param {Number} behaviour tells if the agent is either a coward or a hero
     */
    constructor(x, y, behaviour) {
        this.pos = createVector(x, y);
        this.r = 15;
        this.speed = 2;
        this.force = 0.7;
        this.target = createVector(x, y);
        this.vel = createVector();//velocity
        this.acc = createVector();//acceleration
        this.friend;
        this.enemy;
        this.behaviour = behaviour;
        this.trail = [];
    }
    /**
 * Sets the enemy and the friend of an agent
 * @param {Array} flock Array of agents
 */
    setFriendAndEnemy(flock) {//NEEDS REFACTORING
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
    /**
     * show the agent as circle
     */
    show() {
        switch (this.behaviour) {
            case BEHAVIOURS[0]:
                fill(0, 255, 255);
                break;
            case BEHAVIOURS[1]:
                fill(255, 0, 255);
                break;
            case BEHAVIOURS[2]:
                fill(255, 155, 0);
                break;

            default:
            fill(255);
                break;
        }
        // fill(this.behaviour == 1 ? color(255, 0, 255) : color(0, 255, 255));
        // stroke(0, 255, 0);
        noStroke();
        let theta = this.vel.heading(); //add it later to see the direction of the agent
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);
        beginShape()
        for (let i = 0; i < 3; i++) {
            let angle = map(i, 0, 3, 0, TWO_PI);
            let x = this.r * cos(angle);
            let y = this.r / 2 * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        // rect(0, 0, this.r);
        pop();
        noFill();
        stroke(255, 50);
        beginShape();
        for (const p of this.trail) {
            vertex(p.x, p.y);
        }
        endShape();
    }
    /**
     * shows the connection between agents and their enemy and friends 
     * as well as the target they are aiming for
     */
    debug() {
        let alpha = 100;
        stroke(0, 255, 0, alpha); // friend
        line(this.pos.x, this.pos.y, this.friend.pos.x, this.friend.pos.y);
        stroke(255, 0, 0, alpha); // enemy
        line(this.pos.x, this.pos.y, this.enemy.pos.x, this.enemy.pos.y);
        stroke(0, 255, 255, alpha); // target
        line(this.pos.x, this.pos.y, this.target.x, this.target.y);
        noStroke();
        fill(255, 255, 0);
        ellipse(this.target.x, this.target.y, 4);
    }
    /**
     * 
     * @param {value} behaviour 
     * @returns the position that the agent should reach according to his behaviour
     */
    setTarget(behaviour) {
        // Our Formula to find a third point 
        // on a line given two points 
        // x = x1 +/- distance * dx
        // y = y1 +/- distance * dy
        // + or - define if the new point is 
        // between the two points (+) or (HERO)
        // or outside (-) (COWARD)
        // how to calculate dx & dy
        // dx = x2 - x1;
        // dy = y2 - y1;
        // normalize the values
        // dx /= distance;
        // dy /= distance;
        let v1 = this.enemy.pos;
        let v2 = this.friend.pos;
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        let distance = p5.Vector.dist(v1, v2);
        // console.log(distance);
        //normalization
        dx /= distance;
        dy /= distance;
        let x = 0;
        let y = 0;
        // needs refactoring
        if (behaviour == BEHAVIOURS[0]) {
            // here we calculate the point in ountside two agents
            x = v1.x + ((distance / 2) * -1) * dx;
            y = v1.y + ((distance / 2) * -1) * dy;
        } else if (behaviour == BEHAVIOURS[1]) {
            x = v1.x + (distance / 2) * dx;
            y = v1.y + (distance / 2) * dy;

        } else if (behaviour == BEHAVIOURS[2]) {

            const result = calculate_third_point(v1.x, v1.y, v2.x, v2.y, distance, distance, 60);
            x = result.Bx;
            y = result.By;


        }

        return createVector(x, y);
    }
    edge() {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y > height) this.pos.y = 0;
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
    }    /**
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
        this.edge();
        // here we add the position to the trail Array
        this.trail.push(createVector(this.pos.x, this.pos.y));
        // console.log(this.trail);
        // the trail contains only 50 positions
        if (this.trail.length > 50) this.trail.splice(0, 1);
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
        let desiredseparation = this.r * 1.5; // separate more if trianle mode?
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

/**
 * Find the coordinates for the third point of a triangle.
 *
 * @param Ax - x coordinate value of first known point
 * @param Ay - y coordinate value of first known point
 * @param Cx - x coordinate value of second known point
 * @param Cy - y coordinate value of second known point
 * @param b - the length of side b
 * @param c - the length of side c
 * @param A - the angle of corner A
 * @param alt - set to true to return the alternative solution.
 * @returns {{Bx: *, By: *}}
 */
function calculate_third_point(Ax, Ay, Cx, Cy, b, c, A, alt) {

    let Bx;
    let By;
    alt = typeof alt === 'undefined' ? false : alt;

    //unit vector
    uACx = (Cx - Ax) / b;
    uACy = (Cy - Ay) / b;

    if (alt) {

        //rotated vector
        uABx = uACx * Math.cos(toRadians(A)) - uACy * Math.sin(toRadians(A));
        uABy = uACx * Math.sin(toRadians(A)) + uACy * Math.cos(toRadians(A));

        //B position uses length of edge
        Bx = Ax + c * uABx;
        By = Ay + c * uABy;
    }
    else {
        //vector rotated into another direction
        uABx = uACx * Math.cos(toRadians(A)) + uACy * Math.sin(toRadians(A));
        uABy = - uACx * Math.sin(toRadians(A)) + uACy * Math.cos(toRadians(A));

        //second possible position
        Bx = Ax + c * uABx;
        By = Ay + c * uABy;
    }

    return { Bx: Bx, By: By };
}

/**
 * Convert degrees to radians.
 *
 * @param angle
 * @returns {number}
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}