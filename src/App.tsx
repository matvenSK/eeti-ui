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

function getType(axis: Axis) {
  return (
    (axis.DC >= 0 ? "D" : "C") +
    (axis.IR >= 0 ? "I" : "R") +
    (axis.OA >= 0 ? "O" : "A") +
    (axis.GS >= 0 ? "G" : "S")
  )
}

function matchType(code: string) {
  return types.find((t: any) => t.axes.code === code) || {
    name: code,
    desc: "未定义类型"
  }
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

function AxisBar({
  left,
  right,
  value
}: {
  left: string
  right: string
  value: number
}) {
  // 越大越不容易滑到两端
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
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>(
    Array(questions.length).fill(null)
  )

  const q: any = questions[index]
  const axis = calculateAxis(answers)

  if (!q) {
    const type = getType(axis)
    const info = matchType(type)

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          boxSizing: "border-box",
          fontFamily: "system-ui"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: "white",
            borderRadius: 24,
            padding: "34px 40px 44px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.08)"
          }}
        >
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

          <button
            onClick={() => setIndex(0)}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "13px 0",
              borderRadius: 12,
              border: "none",
              background: "#4f46e5",
              color: "white",
              fontSize: 16,
              fontWeight: 800
            }}
          >
            重新测试
          </button>
        </div>
      </div>
    )
  }

  const selected = answers[index]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        boxSizing: "border-box",
        fontFamily: "system-ui"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "white",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
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
                  fontSize: 15
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
              fontWeight: 800
            }}
          >
            上一页
          </button>

          <button
            onClick={() => {
              if (selected !== null) {
                setIndex(i => i + 1)
              }
            }}
            disabled={selected === null}
            style={{
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: selected === null ? "#c7c7d1" : "#4f46e5",
              color: "white",
              fontWeight: 800
            }}
          >
            {index === questions.length - 1 ? "提交并查看结果" : "提交并下一页"}
          </button>
        </div>
      </div>
    </div>
  )
}