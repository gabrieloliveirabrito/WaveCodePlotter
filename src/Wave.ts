export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
}

type WaveTuple = { [key: string]: (context: CanvasRenderingContext2D, rect: Rect, waveRect: Rect, waveWidth: number, waveHeight: number, wave: string, drawText: boolean) => void }
export type WaveMode = "normal" | "manchester" | "dif-manchester";

const waves: WaveTuple = {
    "normal": (context, rect, waveRect, waveWidth, waveHeight, wave, drawText) => {
        const { x, y } = waveRect
        const waveDash = [6, 5]

        let waveX = 0, waveY = 0
        let lastHigh = false

        for (let m = wave.length, i = 0; i < m; i++) {
            const state = wave[i]
            let isHigh = state === "1"

            if (drawText) {
                const metrics = context.measureText(state)
                context.setLineDash([0, 0])
                context.strokeText(state, x + waveWidth * i - metrics.width / 2, 6 + rect.y + rect.h + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
            }

            waveX = x + waveWidth * i
            waveY = y + (isHigh ? 0 : waveHeight)

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, rect.y)
            context.lineTo(x + waveWidth * i, waveY)
            context.stroke()

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, waveY)
            context.lineTo(x + waveWidth * i, rect.y + rect.h)
            context.stroke()

            if (isHigh !== lastHigh) {
                lastHigh = isHigh

                context.beginPath()
                context.setLineDash([])
                context.moveTo(x + waveWidth * i, waveY)
                context.lineTo(x + waveWidth * i, waveY + waveHeight * (isHigh ? 1 : -1))
                context.stroke()
            }

            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveX, waveY)
            context.lineTo(waveX + waveWidth, waveY)
            context.stroke()
        }

        context.beginPath()
        context.setLineDash(waveDash)
        context.moveTo(waveX + waveWidth, rect.y)
        context.lineTo(waveX + waveWidth, rect.y + rect.h)
        context.stroke()
    },
    "manchester": (context, rect, waveRect, waveWidth, waveHeight, wave, drawText) => {
        const { x, y } = waveRect
        const waveDash = [6, 5]

        let waveX = 0, waveY = 0

        for (let m = wave.length, i = 0; i < m; i++) {
            const state = wave[i]

            const isHigh = state === "1"
            const isHighInverter = isHigh ? 1 : -1

            if (drawText) {
                const metrics = context.measureText(state)
                context.setLineDash([0, 0])
                context.strokeText(state, x + waveWidth * i - metrics.width / 2, 6 + rect.y + rect.h + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
            }

            waveX = x + waveWidth * i
            waveY = y + (isHigh ? 0 : waveHeight)

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, rect.y)
            context.lineTo(x + waveWidth * i, waveY)
            context.stroke()

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, y + waveHeight)
            context.lineTo(x + waveWidth * i, rect.y + rect.h)
            context.stroke()

            context.beginPath()
            context.setLineDash(i === 0 ? waveDash : [])
            context.moveTo(waveX, y)
            context.lineTo(waveX, y + waveHeight)
            context.stroke()

            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveX, waveY)
            context.lineTo(waveX + waveWidth * 0.5, waveY)
            context.stroke()

            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveX + waveWidth * 0.5, waveY)
            context.lineTo(waveX + waveWidth * 0.5, waveY + waveHeight * isHighInverter)
            context.stroke()

            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveX + waveWidth * 0.5, waveY + waveHeight * isHighInverter)
            context.lineTo(waveX + waveWidth, waveY + waveHeight * isHighInverter)
            context.stroke()
        }

        context.beginPath()
        context.setLineDash(waveDash)
        context.moveTo(waveX + waveWidth, rect.y)
        context.lineTo(waveX + waveWidth, rect.y + rect.h)
        context.stroke()
    },
    "dif-manchester": (context, rect, waveRect, waveWidth, waveHeight, wave, drawText) => {
        const { x, y } = waveRect
        const waveDash = [6, 5]

        let waveX = 0, waveY = 0
        let waveState = false

        for (let m = wave.length, i = 0; i < m; i++) {
            const state = wave[i]

            const isHigh = state === "1"

            if (isHigh) waveState = !waveState

            waveX = x + waveWidth * i
            waveY = y + (isHigh ? 0 : waveHeight)

            if (drawText) {
                const metrics = context.measureText(state)
                context.setLineDash([0, 0])
                context.strokeText(state, waveX + waveWidth * 0.5, 6 + rect.y + rect.h + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
            }

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, rect.y)
            context.lineTo(x + waveWidth * i, waveY)
            context.stroke()

            context.beginPath()
            context.setLineDash(waveDash)
            context.moveTo(x + waveWidth * i, y + waveHeight)
            context.lineTo(x + waveWidth * i, rect.y + rect.h)
            context.stroke()

            context.beginPath()
            context.setLineDash(i === 0 ? waveDash : [])
            context.moveTo(waveX, y)
            context.lineTo(waveX, y + waveHeight)
            context.stroke()

            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveX + waveWidth * 0.5, y)
            context.lineTo(waveX + waveWidth * 0.5, y + waveHeight)
            context.stroke()

            if (waveState) {
                context.beginPath()
                context.setLineDash([])
                context.moveTo(waveX, y)
                context.lineTo(waveX + waveWidth * 0.5, y)
                context.stroke()

                context.beginPath()
                context.setLineDash([])
                context.moveTo(waveX + waveWidth * 0.5, y + waveHeight)
                context.lineTo(waveX + waveWidth, y + waveHeight)
                context.stroke()
            } else {
                context.beginPath()
                context.setLineDash([])
                context.moveTo(waveX + waveWidth * 0.5, y)
                context.lineTo(waveX + waveWidth, y)
                context.stroke()

                context.beginPath()
                context.setLineDash([])
                context.moveTo(waveX, y + waveHeight)
                context.lineTo(waveX + waveWidth * 0.5, y + waveHeight)
                context.stroke()
            }
        }

        context.beginPath()
        context.setLineDash(waveDash)
        context.moveTo(waveX + waveWidth, rect.y)
        context.lineTo(waveX + waveWidth, rect.y + rect.h)
        context.stroke()
    }
}

export default function Wave(context: CanvasRenderingContext2D, rect: Rect, waveRect: Rect, waveWidth: number, waveHeight: number, wave: string, mode: WaveMode, drawText: boolean = true) {
    return waves[mode](context, rect, waveRect, waveWidth, waveHeight, wave, drawText)
}