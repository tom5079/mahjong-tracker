import { test } from 'vitest'
import { generateScoringSheet } from './scoring'

test('tsumozon kiriage', () => {
    console.log(JSON.stringify(generateScoringSheet(true, false, false), null, 4))
})