const rounds = [
    '東1', '東2', '東3', '東4',
    '南1', '南2', '南3', '南4',
    '西1', '西2', '西3', '西4',
    '北1', '北2', '北3', '北4'
]
export const convertRound = (index: number) => rounds[index]
export const convertWind = (index: number) => '東南西北'.charAt(index) as '東' | '南' | '西' | '北'