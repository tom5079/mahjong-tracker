import { UpdateEvent, updateEvents } from '$lib/stores/update'

export function GET() {
    const event = new UpdateEvent()
    updateEvents.set(event.id, event)

    const stream = new ReadableStream({
        start(controller) {
            event.on('update', () => {
                controller.enqueue('event: update\ndata: {"message": "State updated"}\n\n')
            })
        },
        cancel() {
            updateEvents.delete(event.id)
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}
