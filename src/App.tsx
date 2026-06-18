import { useState } from "react"
import questions from "./data/questions.json"
import types from "./data/types.json"

/**
 * =========================
 * Axis
 * =========================
 */
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

/**
 * =========================
 * Type logic（不动）
 * =========================
 */
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

/**
 * =========================
 * apply（不动逻辑）
 * =========================
 */
function apply(setAxis: any, tag: string, value: number) {
  const v = value / 5

  setAxis((prev: Axis) => {
    const next = { ...prev }

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
  })
}

/**
 * =========================
 * Axis bar（移动端优化）
 * =========================
 */
function AxisBar({
  left,
  right,
  value
}: {
  left: string
  right: string
  value: number
}) {
  const v = Math.max(-1, Math.min(1, value))
  const percent = ((v + 1) / 2) * 100

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#666",
          marginBottom: 6
        }}
      >
        <span>{left}</span>
        <span>{right}</span>
      </div>

      <div
        style={{
          height: 8,
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
            width: 1,
            background: "#bbb"
          }}
        />

        <div
          style={{
            position: "absolute",
            left: `${percent}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 14,
            color: "#4f46e5",
            fontWeight: 700
          }}
        >
          ●
        </div>
      </div>
    </div>
  )
}

/**
 * =========================
 * APP
 * =========================
 */
export default function App() {
  const [index, setIndex] = useState(0)
  const [axis, setAxis] = useState<Axis>(initAxis)

  const q = questions[index]

  /**
   * =========================
   * RESULT PAGE
   * =========================
   */
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
            maxWidth: 520,
            background: "white",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>EETI 结果</div>

            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#4f46e5",
                marginTop: 6
              }}
            >
              {type}
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginTop: 10
              }}
            >
              {info.name}
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#666",
                marginTop: 6
              }}
            >
              {info.desc}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <AxisBar left="C" right="D" value={axis.DC} />
            <AxisBar left="R" right="I" value={axis.IR} />
            <AxisBar left="A" right="O" value={axis.OA} />
            <AxisBar left="S" right="G" value={axis.GS} />
          </div>
        </div>
      </div>
    )
  }

  /**
   * =========================
   * QUESTION PAGE（手机优化）
   * =========================
   */
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
        {/* progress */}
        <div style={{ fontSize: 12, color: "#888" }}>
          {index + 1} / {questions.length}
        </div>

        {/* question */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginTop: 10,
            marginBottom: 16
          }}
        >
          {q.title}
        </div>

        {/* scale */}
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 12,
            marginBottom: 18,
            fontSize: 13
          }}
        >
          <div>{q.scale?.["-5"]}</div>
          <div style={{ textAlign: "center", margin: "6px 0" }}>VS</div>
          <div>{q.scale?.["5"]}</div>
        </div>

        {/* buttons（移动端关键优化） */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
            gap: 10
          }}
        >
          {[-5, -3, -1, 1, 3, 5].map(v => (
            <button
              key={v}
              onClick={() => {
                apply(setAxis, q.positiveTag, v)
                setTimeout(() => setIndex(i => i + 1), 0)
              }}
              style={{
                padding: "10px 0",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: v > 0 ? "#eef2ff" : "#fff",
                fontWeight: 600
              }}
            >
              {v > 0 ? `+${v}` : v}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}