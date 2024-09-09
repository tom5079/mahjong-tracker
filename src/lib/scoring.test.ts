import { test } from 'vitest'
import { generateScoringSheet } from './scoring'

test('tsumozon kiriage', () => {
    console.log(JSON.stringify(generateScoringSheet({
        kiriage: true,
        fixed30fu: false,
        tsumozon: false
    }), null, 4))
})