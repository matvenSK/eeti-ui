import { useState } from "react"
import questions from "./data/questions.json"
import types from "./data/types.json"

type Axis = {
  DC: number
  IR: number
  OA: number
  GS: number
}

const initAxis: Axis = {
  DC: 0,
  IR: 0,
  OA: 0,
  GS: 0
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f7fb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  boxSizing: "border-box",
  fontFamily: "system-ui"
}

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 760,
  background: "white",
  borderRadius: 24,
  padding: "34px 40px 44px",
  boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
  boxSizing: "border-box"
}

const mainButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 0",
  borderRadius: 12,
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer"
}

function getType(axis: Axis) {
  return (
    (axis.DC >= 0 ? "D" : "C") +
    (axis.IR >= 0 ? "I" : "R") +
    (axis.OA >= 0 ? "O" : "A") +
    (axis.GS >= 0 ? "G" : "S")
  )
}

function matchType(code: string) {
  return (
    types.find((t: any) => t.axes.code === code) || {
      name: code,
      desc: "未定义类型"
    }
  )
}

function applyToAxis(axis: Axis, tag: string, value: number) {
  const v = value / 5
  const next = { ...axis }

  for (const c of tag) {
    switch (c) {
      case "D":
        next.DC += v
        break
      case "C":
        next.DC -= v
        break
      case "I":
        next.IR += v
        break
      case "R":
        next.IR -= v
        break
      case "O":
        next.OA += v
        break
      case "A":
        next.OA -= v
        break
      case "G":
        next.GS += v
        break
      case "S":
        next.GS -= v
        break
    }
  }

  return next
}

function calculateAxis(answers: Array<number | null>) {
  let axis = { ...initAxis }

  answers.forEach((answer, i) => {
    if (answer !== null) {
      const q: any = questions[i]
      axis = applyToAxis(axis, q.positiveTag, answer)
    }
  })

  return axis
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  let line = ""
  const chars = text.split("")

  for (const ch of chars) {
    const testLine = line + ch

    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, x + maxWidth / 2, y)
      line = ch
      y += lineHeight
    } else {
      line = testLine
    }
  }

  if (line) {
    ctx.fillText(line, x + maxWidth / 2, y)
  }
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  left: string,
  right: string,
  value: number,
  y: number
) {
  const displayRange = 8
  const v = Math.max(-displayRange, Math.min(displayRange, value))
  const percent = (v + displayRange) / (2 * displayRange)

  const x0 = 180
  const x1 = 900
  const barY = y + 45

  ctx.fillStyle = "#555"
  ctx.font = "28px system-ui"
  ctx.textAlign = "left"
  ctx.fillText(left, x0, y)

  ctx.textAlign = "right"
  ctx.fillText(right, x1, y)

  ctx.strokeStyle = "#ddd"
  ctx.lineWidth = 16
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(x0, barY)
  ctx.lineTo(x1, barY)
  ctx.stroke()

  ctx.strokeStyle = "#bbb"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo((x0 + x1) / 2, barY - 18)
  ctx.lineTo((x0 + x1) / 2, barY + 18)
  ctx.stroke()

  const dotX = x0 + (x1 - x0) * percent

  ctx.fillStyle = "#4f46e5"
  ctx.beginPath()
  ctx.arc(dotX, barY, 18, 0, Math.PI * 2)
  ctx.fill()
}

function AxisBar({
  left,
  right,
  value
}: {
  left: string
  right: string
  value: number
}) {
  const displayRange = 8
  const v = Math.max(-displayRange, Math.min(displayRange, value))
  const percent = ((v + displayRange) / (2 * displayRange)) * 100

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          color: "#555",
          marginBottom: 10,
          gap: 16
        }}
      >
        <span>{left}</span>
        <span>{right}</span>
      </div>

      <div
        style={{
          height: 10,
          background: "#eee",
          borderRadius: 999,
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            background: "#bbb"
          }}
        />

        <div
          style={{
            position: "absolute",
            left: `${percent}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#4f46e5"
          }}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<"start" | "test" | "result">("start")
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>(
    Array(questions.length).fill(null)
  )

  const q: any = questions[index]
  const axis = calculateAxis(answers)

  function resetTest() {
    setAnswers(Array(questions.length).fill(null))
    setIndex(0)
    setPage("start")
  }

  function downloadReportImage() {
    const type = getType(axis)
    const info = matchType(type)

    const canvas = document.createElement("canvas")
    canvas.width = 1080
    canvas.height = 1440

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#f6f7fb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    roundRect(ctx, 80, 80, 920, 1280, 40)
    ctx.fill()

    ctx.textAlign = "center"

    ctx.fillStyle = "#666"
    ctx.font = "bold 48px system-ui"
    ctx.fillText("EETI 测试结果", 540, 180)

    ctx.fillStyle = "#4f46e5"
    ctx.font = "bold 120px system-ui"
    ctx.fillText(type, 540, 330)

    ctx.fillStyle = "#665d66"
    ctx.font = "bold 44px system-ui"
    ctx.fillText(info.name, 540, 405)

    ctx.fillStyle = "#555"
    ctx.font = "28px system-ui"
    ctx.textAlign = "center"
    wrapText(ctx, info.desc, 160, 485, 760, 46)

    drawAxis(ctx, "Continuous", "Discrete", axis.DC, 700)
    drawAxis(ctx, "Real", "Ideal", axis.IR, 840)
    drawAxis(ctx, "Accumulation", "Offshoot", axis.OA, 980)
    drawAxis(ctx, "Specific", "General", axis.GS, 1120)

    ctx.fillStyle = "#999"
    ctx.font = "24px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("Generated by EETI", 540, 1285)

    const link = document.createElement("a")
    link.download = `EETI-${type}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  if (page === "start") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: "#4f46e5",
              marginBottom: 10
            }}
          >
            EETI
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#444",
              marginBottom: 18
            }}
          >
            四轴倾向测试
          </div>

          <div
            style={{
              fontSize: 17,
              color: "#555",
              lineHeight: 1.9,
              maxWidth: 560,
              margin: "0 auto 30px"
            }}
          >
            你将完成 {questions.length} 道选择题。每题从左右两个描述中选择更接近你的倾向，
            最后生成 EETI 类型与四轴报告图。
          </div>

          <button onClick={() => setPage("test")} style={mainButtonStyle}>
            开始测试
          </button>
        </div>
      </div>
    )
  }

  if (page === "result") {
    const type = getType(axis)
    const info = matchType(type)

    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#666",
                lineHeight: 1.15
              }}
            >
              EETI 结果
            </div>

            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                color: "#4f46e5",
                lineHeight: 1.05,
                marginTop: 8,
                marginBottom: 12,
                letterSpacing: 2
              }}
            >
              {type}
            </div>

            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#665d66",
                lineHeight: 1.25,
                marginBottom: 22
              }}
            >
              {info.name}
            </div>

            <div
              style={{
                fontSize: 18,
                color: "#555",
                lineHeight: 1.9,
                margin: "0 auto",
                maxWidth: 650
              }}
            >
              {info.desc}
            </div>
          </div>

          <div style={{ marginTop: 34 }}>
            <AxisBar left="Continuous" right="Discrete" value={axis.DC} />
            <AxisBar left="Real" right="Ideal" value={axis.IR} />
            <AxisBar left="Accumulation" right="Offshoot" value={axis.OA} />
            <AxisBar left="Specific" right="General" value={axis.GS} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 18
            }}
          >
            <button onClick={downloadReportImage} style={mainButtonStyle}>
              生成报告图
            </button>

            <button onClick={resetTest} style={mainButtonStyle}>
              重新测试
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selected = answers[index]

  return (
    <div style={pageStyle}>
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "white",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          boxSizing: "border-box"
        }}
      >
        <div style={{ fontSize: 12, color: "#888" }}>
          {index + 1} / {questions.length}
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginTop: 10,
            marginBottom: 16,
            lineHeight: 1.5
          }}
        >
          {q.title}
        </div>

        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 12,
            marginBottom: 18,
            fontSize: 14,
            lineHeight: 1.6
          }}
        >
          <div>
            <b style={{ color: "#c2410c" }}>（左/负）</b>
            {q.scale?.["-5"]}
          </div>

          <div style={{ textAlign: "center", margin: "6px 0", color: "#888" }}>
            VS
          </div>

          <div>
            <b style={{ color: "#4338ca" }}>（右/正）</b>
            {q.scale?.["5"]}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
            gap: 10
          }}
        >
          {[-5, -3, -1, 1, 3, 5].map(v => {
            const isSelected = selected === v

            return (
              <button
                key={v}
                onClick={() => {
                  setAnswers(prev => {
                    const next = [...prev]
                    next[index] = v
                    return next
                  })
                }}
                style={{
                  padding: "11px 0",
                  borderRadius: 10,
                  border: isSelected
                    ? "2px solid #4f46e5"
                    : "1px solid #e5e7eb",
                  background: v > 0 ? "#eef2ff" : "#fff7ed",
                  color: v > 0 ? "#4338ca" : "#c2410c",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer"
                }}
              >
                {v > 0 ? `+${v}` : v}
              </button>
            )
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 20
          }}
        >
          <button
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            disabled={index === 0}
            style={{
              padding: "12px 0",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: index === 0 ? "#f3f4f6" : "#fff",
              color: index === 0 ? "#aaa" : "#444",
              fontWeight: 800,
              cursor: index === 0 ? "not-allowed" : "pointer"
            }}
          >
            上一页
          </button>

          <button
            onClick={() => {
              if (selected !== null) {
                if (index === questions.length - 1) {
                  setPage("result")
                } else {
                  setIndex(i => i + 1)
                }
              }
            }}
            disabled={selected === null}
            style={{
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: selected === null ? "#c7c7d1" : "#4f46e5",
              color: "white",
              fontWeight: 800,
              cursor: selected === null ? "not-allowed" : "pointer"
            }}
          >
            {index === questions.length - 1 ? "提交并查看结果" : "提交并下一页"}
          </button>
        </div>
      </div>
    </div>
  )
}