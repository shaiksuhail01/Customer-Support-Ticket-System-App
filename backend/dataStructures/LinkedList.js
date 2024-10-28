class Node {
    constructor(ticket) {
        this.ticket = ticket;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    // Add a ticket to the end of the list
    add(ticket) {
        const newNode = new Node(ticket);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    // Display all tickets in the linked list
    display() {
        let current = this.head;
        const tickets = [];
        while (current) {
            tickets.push(current.ticket);
            current = current.next;
        }
        return tickets;
    }

    // Remove a ticket by ID
    delete(ticketId) {
        let current = this.head;
        let previous = null;

        while (current) {
            if (current.ticket._id === ticketId) {
                if (previous === null) {

                    this.head = current.next;
                } else {
                    
                    previous.next = current.next;
                }
                if (current === this.tail) {
                    this.tail = previous;
                }
                
                return true; 
            }
            
            previous = current;
            current = current.next;
        }

        return false; 
    }

    clear() {
        this.head = null;
        this.tail = null;
    }
}

module.exports = LinkedList;
