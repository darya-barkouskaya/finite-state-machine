class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
constructor(config) {
        if (config === null) {
            throw Error();
        }

        this.config = config;
        this.currentState =config.initial;
        this.states = [config.initial];
        this.position = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var varExist= Object.keys(this.config.states).some(function(key) {
            return key === state;
        });

        if (varExist) {
            this.states.push(state);
            this.position = this.states.length - 1;
            this.currentState = state;
        } else {
            throw Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var events = this.config.states[this.currentState].transitions;
        var varExist = Object.keys(events).some(function(key) {
            return key === event;
        });

        if (varExist) {
            this.states= this.states.slice(0, this.position + 1);
            this.states.push(events[event]);
            this.position = this.states.length - 1;
            this.currentState = this.states[this.position];
        } else {
            throw Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.states = [];
        this.states.push(this.config.initial);
        this.position = 0;
        this.currentState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var states = [];

        if (!event) {
            states = Object.keys(this.config.states);
        } else {
            Object.keys(this.config.states).forEach(state => {
                Object.keys(this.config.states[state].transitions).forEach(eventOfState => {
                    if (event === eventOfState) {
                        states.push(state);
                    }
                })
            });
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        var isAvail = false;

        if (this.position != 0) {
            this.currentState =this.states[this.position - 1];
            this.position--;
            isAvail = true;
        }

        return isAvail;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        var isAvail = false;

        if (this.position + 1 <this.states.length) {
            this.currentState=this.states[this.position + 1];
            this.position++;
            isAvail = true;
        }

        return isAvail;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.states= [];
        this.states.push(this.currentState);
        this.position = 0;
    }
}

module.exports = FSM;
