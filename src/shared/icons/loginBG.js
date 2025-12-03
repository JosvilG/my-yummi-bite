import * as React from "react"
import { Dimensions } from "react-native"
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const screenWidth = Dimensions.get('window').width;

function SvgComponent(props) {
  return (
    <Svg
      width={screenWidth}
      height={590}
      viewBox="0 0 375 590"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#prefix__filter0_d)">
        <Path
          d="M358.961 149.261C154.952 115.281-.017 254.2-52 327.907v207.69c28.77-89.739 143.5-59.05 187.5-39.367C202.023 525.989 254.747 576 358.961 576c109.223 0 204.009-392.759 0-426.739z"
          fill="url(#prefix__paint0_radial)"
        />
      </G>
      <G filter="url(#prefix__filter1_d)">
        <Path
          d="M81.218 14.152c2.746-7.816 11.308-11.926 19.124-9.18l57.789 20.304c7.816 2.746 11.926 11.308 9.18 19.124l-35.246 100.318c-2.746 7.816-11.308 11.926-19.124 9.18l-57.79-20.303c-7.815-2.746-11.925-11.308-9.179-19.124L81.218 14.152z"
          fill="url(#prefix__paint1_linear)"
        />
      </G>
      <G filter="url(#prefix__filter2_d)">
        <Path
          d="M234.143 16.968a7 7 0 015.763-8.049l10.727-1.776a7.001 7.001 0 018.05 5.763l3.786 22.87a7 7 0 01-5.763 8.05l-10.727 1.776a7.001 7.001 0 01-8.05-5.763l-3.786-22.87z"
          fill="url(#prefix__paint2_linear)"
        />
      </G>
      <G filter="url(#prefix__filter3_d)">
        <Path
          d="M271.883 78.64c-4.315-7.071-2.081-16.302 4.99-20.618l16.609-10.136c7.072-4.315 16.303-2.081 20.618 4.99l22.886 37.5c4.315 7.072 2.081 16.303-4.99 20.619l-16.61 10.136c-7.071 4.315-16.302 2.081-20.618-4.99l-22.885-37.5z"
          fill="url(#prefix__paint3_linear)"
        />
      </G>
      <G filter="url(#prefix__filter4_d)">
        <Path
          d="M14.892 171.8c-3.254-7.619.284-16.433 7.902-19.687l7.54-3.221c7.618-3.254 16.432.284 19.686 7.902l10.646 24.922c3.254 7.619-.283 16.433-7.902 19.687l-7.54 3.221c-7.617 3.254-16.431-.284-19.686-7.902L14.892 171.8z"
          fill="url(#prefix__paint4_linear)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={129.236}
          y1={15.124}
          x2={84.047}
          y2={143.747}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F5C73B" />
          <Stop offset={0.385} stopColor="#E78440" />
          <Stop offset={0.698} stopColor="#FC633A" />
          <Stop offset={1} stopColor="#F23838" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={245.27}
          y1={8.031}
          x2={251.342}
          y2={44.714}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F5C73B" />
          <Stop offset={0.385} stopColor="#E78440" />
          <Stop offset={0.698} stopColor="#FC633A" />
          <Stop offset={1} stopColor="#F23838" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={285.178}
          y1={52.954}
          x2={323.691}
          y2={116.063}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F5C73B" />
          <Stop offset={0.385} stopColor="#E78440" />
          <Stop offset={0.698} stopColor="#FC633A" />
          <Stop offset={1} stopColor="#F23838" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint4_linear"
          x1={26.564}
          y1={150.503}
          x2={48.995}
          y2={203.013}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F5C73B" />
          <Stop offset={0.385} stopColor="#E78440" />
          <Stop offset={0.698} stopColor="#FC633A" />
          <Stop offset={1} stopColor="#F23838" />
        </LinearGradient>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-350.6405 163.65539 -247.12026 -529.4685 330.517 243.581)"
        >
          <Stop stopColor="#F5C73B" />
          <Stop offset={0.255} stopColor="#FCB13A" />
          <Stop offset={0.505} stopColor="#E68440" />
          <Stop offset={0.76} stopColor="#FC633A" />
          <Stop offset={1} stopColor="#F23838" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
