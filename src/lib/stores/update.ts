import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

export class UpdateEvent extends EventEmitter {
    id: string

    constructor() {
        super();
        this.id = uuidv4()
    }
    notify() {
        this.emit('update')
    }
}

export const updateEvents: Map<string, UpdateEvent> = new Map()

export function sendUpdate() {
    for (const event of updateEvents.values()) {
        event.notify()
    }
}
