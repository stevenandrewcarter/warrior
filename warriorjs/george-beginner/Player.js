class Player {
    constructor() {
        this._health = 20;
        this._direction = 'forward';
    }

    // Check if the warrior should heal. Conditions for healing is if the warrior has less than a particular amount of
    // health and has not taken any damage recently. Otherwise the warrior will walk in the given direction.
    checkToHeal(warriorHealth) {
        if (warriorHealth < 18) {
            return this._health <= warriorHealth;
        }
        return false;
    }

    lookAround(warrior) {
        var spaces = warrior.look(this._direction);
        for (var i = 0; i < spaces.length; i++) {
            if (spaces[i].isCaptive()) {
                return false;
            }
            else if (spaces[i].isEnemy()) {
                warrior.shoot();
                return true;
            }
        }
        return false;
    }

    feelAround(warrior) {
        var space = warrior.feel(this._direction);
        if (space.isWall()) {
            warrior.pivot();
        } else if (space.isCaptive()) {
            warrior.rescue(this._direction);
        } else if (space.isEnemy()) {
            warrior.attack(this._direction);
        } else {
            warrior.walk(this._direction);
        }
    }

    playTurn(warrior) {
        if (this._health === warrior.health() && this.lookAround(warrior)) {

        }
        else if (warrior.feel(this._direction).isEmpty() && !warrior.feel(this._direction).isStairs()) {
            if (this.checkToHeal(warrior.health())) {
                warrior.rest();
            } else {
                if (this._health < 10) {
                    warrior.walk(this._direction === 'backward' ? 'forward' : 'backward');
                } else {
                    warrior.walk(this._direction);
                }
            }
        } else {
            this.feelAround(warrior);
        }
        this._health = warrior.health();
    }
}
