import { useState } from "react"
import questions from "./data/questions.json"
import types from "./data/types.json"

/**
 * =========================
 * ⭐ 唯一状态：4轴模型
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
 * 类型计算（唯一真值）
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

/**
 * =========================
 * types.json匹配
 * =========================
 */
function matchType(code: string) {
  return types.find((t: any) => t.axes.code === code) || {
    name: code,
    desc: "未定义类型"
  }
}

/**
 * =========================
 * ⭐ axis更新（不改逻辑）
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
 * 轴条 UI（升级但轻量）
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
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "#555",
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f6f7fb",
          fontFamily: "system-ui"
        }}
      >
        <div
          style={{
            width: 560,
            background: "white",
            borderRadius: 18,
            padding: 30,
            boxShadow: "0 12px 35px rgba(0,0,0,0.08)"
          }}
        >
          {/* 标题区（彻底解决重叠问题） */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 1
              }}
            >
              EETI 结果
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#4f46e5",
                lineHeight: 1,
                marginTop: 6
              }}
            >
              {type}
            </div>

            {/* ⭐ 中文类型名：更明显 */}
            <div
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: 800,
                color: "#111"
              }}
            >
              {info.name}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#666",
                lineHeight: 1.5
              }}
            >
              {info.desc}
            </div>
          </div>

          <hr style={{ margin: "18px 0" }} />

          <AxisBar left="Discrete" right="Continuous" value={-axis.DC} />
          <AxisBar left="Ideal" right="Real" value={-axis.IR} />
          <AxisBar left="Offshoot" right="Accumulation" value={-axis.OA} />
          <AxisBar left="General" right="Specific" value={-axis.GS} />
        </div>
      </div>
    )
  }

  /**
   * =========================
   * QUESTION PAGE
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
        fontFamily: "system-ui"
      }}
    >
      <div
        style={{
          width: 620,
          background: "white",
          borderRadius: 18,
          padding: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        {/* progress */}
        <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
          第 {index + 1} / {questions.length} 题
        </div>

        {/* question */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 18
          }}
        >
          {q.title}
        </div>

        {/* scale */}
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 14,
            marginBottom: 22
          }}
        >
          <div>{q.scale?.["-5"]}（左/负）</div>
          <div style={{ textAlign: "center", margin: "8px 0", color: "#999" }}>
            VS
          </div>
          <div>{q.scale?.["5"]}（右/正）</div>
        </div>

        {/* buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 10
          }}
        >
          {[-5, -3, -1, 1, 3, 5].map(v => (
            <button
              key={v}
              onClick={() => {
                apply(setAxis, q.positiveTag, v)

                setTimeout(() => {
                  setIndex(i => i + 1)
                }, 0)
              }}
              style={{
                padding: "10px 0",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: v > 0 ? "#eef2ff" : "#fff",
                color: v > 0 ? "#4f46e5" : "#111",
                fontWeight: 600,
                cursor: "pointer"
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