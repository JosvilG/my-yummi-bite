import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { COLORS } from "@/constants/theme"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function ProfileIcon(props) {
    return (
        <Svg
            width={36}
            height={34}
            viewBox="0 0 36 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clipPath="url(#prefix__clip0)" filter="url(#prefix__filter0_d)">
                <Path
                    d="M18 2.435c-1.91 0-3.4.672-4.474 2.016-1.074 1.344-1.611 3.063-1.611 5.155-.013 2.6.862 4.66 2.625 6.182.225.203.305.463.238.78l-.457.913a1.64 1.64 0 01-.646.713c-.285.172-.885.416-1.8.733l-2.516.78c-1.637.507-2.509.786-2.615.836-1.113.444-1.842.907-2.187 1.389C4.186 22.731 4 24.754 4 28h28c0-3.246-.186-5.27-.557-6.068-.345-.482-1.074-.945-2.187-1.389-.106-.05-.978-.33-2.615-.837a2811.93 2811.93 0 01-2.516-.78c-.915-.316-1.515-.56-1.8-.732a1.64 1.64 0 01-.646-.713l-.457-.913c-.067-.317.013-.577.238-.78 1.764-1.522 2.639-3.582 2.625-6.182 0-2.092-.537-3.81-1.61-5.155C21.4 3.107 19.908 2.435 18 2.435z"
                    fill={COLORS.primary}
                />
            </G>
            <Defs>
                <ClipPath id="prefix__clip0">
                    <Path fill="#fff" transform="translate(4)" d="M0 0h28v28H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default ProfileIcon
