import * as React from "react"
import Svg, { Path } from "react-native-svg"

function InfoIcon(props) {
  return (
    <Svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.002 0c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001C4.478 20.003 0 15.525 0 10.002 0 4.478 4.478 0 10.002 0zm-.004 8.25a1 1 0 00-.992.885l-.007.116.003 5.502.007.117a1 1 0 001.987-.002l.006-.117-.003-5.501-.007-.117a1 1 0 00-.994-.882V8.25zm.004-3.749a1.251 1.251 0 100 2.503 1.251 1.251 0 000-2.503z"
        fill="#FF8A9B"
      />
    </Svg>
  )
}

export default InfoIcon