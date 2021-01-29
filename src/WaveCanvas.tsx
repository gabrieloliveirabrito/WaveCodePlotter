import React, { useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import Wave, { WaveMode, Rect } from './Wave';

const waves: string[] = [
    "000111010101010", "1111010101011000", "00000100010000", "11111111010111110", "001100011100010", "01101011111111000", "001010100010100"
]
const waveWidth = 50
const waveHeight = 50
const waveMarginX = 15
const waveMarginY = 20

interface WaveCanvasProps {
    mode: WaveMode;
}

export default function WaveCanvas(props: WaveCanvasProps) {
    const { mode } = props
    const canvasRef = useRef(null)
    const history = useHistory()

    useEffect(() => {
        drawCanvas()
    }, [history, history.location, history.location.pathname])

    function drawCanvas() {
        if (canvasRef.current) {
            const canvas: HTMLCanvasElement = canvasRef.current!
            const context = canvas.getContext("2d");

            console.log(canvas.width, canvas.height)
            context?.clearRect(0, 0, canvas.width, canvas.height)
            context!.imageSmoothingEnabled = true

            context!.lineWidth = 1.5
            context!.strokeStyle = "black"
            context!.font = "20px sans-serif"

            for (let m = waves.length, i = 0; i < m; i++) {
                const wave = waves[i]
                const rect: Rect = {
                    x: waveMarginX * 5,
                    y: waveHeight * i + waveMarginY * 2 * i + waveMarginY * i * 3 + 9,
                    w: canvas.width - waveMarginX * 6,
                    h: waveHeight + waveMarginY * 2
                }

                context?.strokeText(String.fromCharCode('A'.charCodeAt(0) + i), waveMarginX, rect.y + waveHeight / 2 + waveMarginY / 2)

                context?.beginPath()
                context?.rect(rect.x, rect.y, rect.w, rect.h)
                context?.stroke()

                const waveRect: Rect = {
                    x: rect.x + waveMarginX,
                    y: rect.y + waveMarginY,
                    w: rect.w - waveMarginX,
                    h: rect.h + waveMarginY
                }
                context?.beginPath()
                context?.setLineDash([0, 0])
                context?.strokeText('1', rect.x - waveMarginX, rect.y + waveMarginY + 3)
                context?.strokeText('0', rect.x - waveMarginX, rect.y + waveMarginY + waveHeight + 3)

                context?.beginPath()
                context?.setLineDash([2, 2])
                context?.moveTo(rect.x, rect.y + waveMarginY)
                context?.lineTo(rect.x + rect.w, rect.y + waveMarginY)
                context?.stroke()

                context?.beginPath()
                context?.setLineDash([2, 2])
                context?.moveTo(rect.x, rect.y + waveMarginY + waveHeight)
                context?.lineTo(rect.x + rect.w, rect.y + waveMarginY + waveHeight)
                context?.stroke()

                Wave(context!, rect, waveRect, waveWidth, waveHeight, wave, mode)

                context?.beginPath()
                context?.setLineDash([0, 0])
                context?.moveTo(0, waveRect.y + waveRect.h + 6)
                context?.lineTo(canvas.width, waveRect.y + waveRect.h + 6)
                context?.stroke()
            }
        }
    }

    function calcCanvasHeight() {
        return waves.length * waveHeight + waves.length * 2 * waveMarginY + waveMarginY * waveMarginY
    }

    return (
        <div id="container" style={{ display: "flex", padding: 15, flex: 1, flexDirection: "column" }}>
            <canvas width={1024} height={calcCanvasHeight() * 1.5} style={{ display: "flex", width: "100%" }} ref={canvasRef}>
            </canvas>
        </div>
    );
}