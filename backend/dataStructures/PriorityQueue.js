class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // Add a ticket to the queue
    enqueue(ticket) {
        if (this.isEmpty()) {
            this.queue.push(ticket);
        } else {
            let added = false;
            for (let i = 0; i < this.queue.length; i++) {
                if (ticket.severity < this.queue[i].severity) {
                    this.queue.splice(i, 0, ticket);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.queue.push(ticket);
            }
        }
    }

    dequeue() {
        return this.queue.shift();
    }
    
    isEmpty() {
        return this.queue.length === 0;
    }

    // Get the first ticket without removing it
    peek() {
        return this.queue[0];
    }

    // Get all tickets in the queue
    getAll() {
        return this.queue;
    }
}

module.exports = PriorityQueue;
