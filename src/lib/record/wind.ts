export function convertWind(text: string) {
    return text
        .replaceAll('N', '北')
        .replaceAll('E', '東')
        .replaceAll('S', '南')
        .replaceAll('W', '西')
}