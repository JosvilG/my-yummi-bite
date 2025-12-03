import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { COLORS } from "@/constants/theme"

function HomeIcon(props) {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M25.996 13.771L14.298.762c-.493-.549-1.44-.549-1.932 0L.667 13.772a1.299 1.299 0 00-.22 1.4c.207.469.673.77 1.186.77h2.6v9.107a1.302 1.302 0 001.3 1.301h3.9a1.3 1.3 0 001.3-1.3v-5.204h5.199v5.203a1.302 1.302 0 001.3 1.301h3.899a1.3 1.3 0 001.3-1.3v-9.107h2.6a1.296 1.296 0 001.286-1.505 1.3 1.3 0 00-.32-.667z"
        fill={COLORS.primary}
      />
    </Svg>
  )
}

export default HomeIcon
