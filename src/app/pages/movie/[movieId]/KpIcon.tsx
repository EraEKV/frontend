export const KpIcon = ({height} : {height : string}) => {
    return (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-${height} w-auto`}>
            <mask id="mask0_1_69" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
            <circle cx="150" cy="150" r="150" fill="white"/>
            </mask>
            <g mask="url(#mask0_1_69)">
            <circle cx="150" cy="150" r="150" fill="black"/>
            <path d="M300 45L145.26 127.827L225.9 45H181.2L126.3 121.203V45H89.9999V255H126.3V178.92L181.2 255H225.9L147.354 174.777L300 255V216L160.776 160.146L300 169.5V130.5L161.658 139.494L300 84V45Z" fill="url(#paint0_radial_1_69)"/>
            </g>
            <defs>
            <radialGradient id="paint0_radial_1_69" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(89.9999 45) rotate(45) scale(296.985)">
            <stop offset="0.5" stopColor="#FF5500"/>
            <stop offset="1" stopColor="#BBFF00"/>
            </radialGradient>
            </defs>
        </svg>
    )
}