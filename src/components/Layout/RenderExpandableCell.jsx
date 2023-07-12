import Tooltip from "@material-ui/core/Tooltip"
import { useEffect, useRef, useState } from "react"

const RenderExpandableCell = (props) => {
  const [isOverflowed, setIsOverflow] = useState(false)
  const { value } = props

  const textElementRef = useRef(null)

  const checkOverflow = () => {
    const clientWidth = textElementRef.current.getBoundingClientRect().width

    textElementRef.current.style.overflow = "visible"
    const contentWidth = textElementRef.current.getBoundingClientRect().width
    textElementRef.current.style.overflow = "hidden"

    setIsOverflow(contentWidth > clientWidth)
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => {
      window.removeEventListener("resize", checkOverflow)
    }
  }, [])

  return (
    <Tooltip title={<span style={{fontSize: "1rem"}}>{value}</span>} disableHoverListener={!isOverflowed}>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {value}
      </span>
    </Tooltip>
  )
}

export default RenderExpandableCell
