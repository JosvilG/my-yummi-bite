import * as React from "react"
import Svg, { G, Path, Defs } from "react-native-svg"
import { COLORS } from "@/constants/theme"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Add(props) {
    return (
        <Svg
            width={33}
            height={34}
            viewBox="0 0 33 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G filter="url(#prefix__filter0_d)">
                <Path
                    d="M16.667 2.75C9.902 2.75 4.417 8.235 4.417 15s5.485 12.25 12.25 12.25c6.764 0 12.25-5.485 12.25-12.25S23.43 2.75 16.667 2.75zm5.25 12.906a.22.22 0 01-.22.219h-4.155v4.156a.22.22 0 01-.22.219H16.01a.22.22 0 01-.218-.219v-4.156h-4.156a.22.22 0 01-.22-.219v-1.312a.22.22 0 01.22-.219h4.156V9.969a.22.22 0 01.218-.219h1.313a.22.22 0 01.219.219v4.156h4.156a.22.22 0 01.219.219v1.312z"
                    fill={COLORS.primary}
                />
            </G>
            <Defs></Defs>
        </Svg>
    )
}

export default Add
