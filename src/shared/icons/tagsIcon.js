import * as React from "react"
import Svg, { Path } from "react-native-svg"

function TagsIcon(props) {
  return (
    <Svg
      width={18}
      height={14}
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17.223 6.587L13.89.753a.834.834 0 00-.723-.42H1.5A.833.833 0 00.777 1.58L3.874 7 .777 12.42a.833.833 0 00.723 1.247h11.667a.834.834 0 00.723-.42l3.333-5.834a.831.831 0 000-.826z"
        fill="#FC633A"
      />
    </Svg>
  )
}

export default TagsIcon