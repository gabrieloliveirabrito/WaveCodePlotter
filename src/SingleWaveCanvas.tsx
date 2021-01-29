import React, { useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import Wave, { WaveMode, Rect } from './Wave';

const waveWidth = 50
const waveHeight = 50
const waveMarginX = 25
const waveMarginY = 30

const waves: { mode: WaveMode, title: string }[] = [
    { mode: "normal", title: "Cod. Binária Direta" },
    { mode: "manchester", title: "Cod. Manchester" },
    { mode: "dif-manchester", title: "Cod. Manchester Diferencial" },
]

const wavesExamples: string[] = [
    "000111010101010", "1111010101011000", "00000100010000", "11111111010111110", "001100011100010", "01101011111111000", "001010100010100"
]


export default function SingleWaveCanvas() {
    const canvasRef = useRef(null)
    const history = useHistory()
    const [waveString, setWaveString] = useState("10000101111")

    useEffect(() => {
        drawCanvas()
    }, [history, history.location, history.location.pathname, waveString])

    function drawCanvas() {
        if (canvasRef.current) {
            const canvas: HTMLCanvasElement = canvasRef.current!
            const context = canvas.getContext("2d")!;

            console.log(canvas.width, canvas.height)
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.imageSmoothingEnabled = true

            context.lineWidth = 1.5
            context.strokeStyle = "black"
            context.font = "15px sans-serif"

            for (let m = waveString.length, i = 0; i < m; i++) {
                const state = waveString.charAt(i)
                const metrics = context.measureText(state)

                context.beginPath()
                context.setLineDash([])
                context.moveTo(waveMarginX * 10 + waveWidth * i, 0)
                context.lineTo(waveMarginX * 10 + waveWidth * i, waveHeight / 2)
                context.stroke()

                context.strokeText(state, waveMarginX * 10 + waveWidth * i + waveWidth / 2 - metrics.width / 2, waveHeight / 4)
            }
            context.beginPath()
            context.setLineDash([])
            context.moveTo(waveMarginX * 10 + waveWidth * waveString.length, 0)
            context.lineTo(waveMarginX * 10 + waveWidth * waveString.length, waveHeight / 2)
            context.stroke()

            for (let m = waves.length, i = 0; i < m; i++) {
                const wave = waves[i]
                const rect: Rect = {
                    x: waveMarginX * 10,
                    y: waveHeight * i + waveMarginY * 2 * i + waveHeight / 2,
                    w: waveWidth * waveString.length,
                    h: waveHeight + waveMarginY * 2
                }

                context.setLineDash([])
                context.strokeText(wave.title, 0, rect.y + waveHeight / 2 + waveMarginY)

                context.beginPath()
                context.rect(rect.x, rect.y, rect.w, rect.h)
                context.stroke()

                const waveRect: Rect = {
                    x: rect.x + waveMarginX,
                    y: rect.y + waveMarginY,
                    w: rect.w - waveMarginX,
                    h: rect.h + waveMarginY
                }
                context.beginPath()
                context.setLineDash([0, 0])
                context.strokeText('1', rect.x - waveMarginX, rect.y + waveMarginY + 3)
                context.strokeText('0', rect.x - waveMarginX, rect.y + waveMarginY + waveHeight + 3)

                context.beginPath()
                context.setLineDash([2, 2])
                context.moveTo(rect.x, rect.y + waveMarginY)
                context.lineTo(rect.x + rect.w, rect.y + waveMarginY)
                context.stroke()

                context.beginPath()
                context.setLineDash([2, 2])
                context.moveTo(rect.x, rect.y + waveMarginY + waveHeight)
                context.lineTo(rect.x + rect.w, rect.y + waveMarginY + waveHeight)
                context.stroke()

                Wave(context!, rect, waveRect, waveWidth, waveHeight, waveString, wave.mode, false)
            }
        }
    }

    return (
        <div id="container" style={{ display: "flex", padding: 15, flex: 1, flexDirection: "column" }}>
            <div style={{ flex: 1, flexDirection: "row" }}>
                <input type="text" value={waveString} onChange={e => setWaveString(e.target.value)} />
                <select value={waveString} onChange={e => e.target.selectedIndex !== 0 && setWaveString(e.target.value)}>
                    <option>Selecione um abaixo</option>
                    {wavesExamples.map((we, i) => <option key={i} value={we}>{we}</option>)}
                </select>
            </div>
            <canvas width={waveMarginX * 10 + waveWidth * waveString.length + 6} height={waveHeight / 2 + (waveHeight + waveMarginY * 2) * 3} style={{ display: "flex", flex: 1, width: "100%" }} ref={canvasRef}>
            </canvas>
        </div>
    );
}