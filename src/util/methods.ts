export const genEmbed = (input: string, colour: 1 | 2 | 3) => {
    return {
        embed: {
            description: input,
            color: colour === 1
                ? 0x18de2f // #18de2f
                : colour === 2
                    ? 0xde6418 // #de6418
                    : 0xde1f18 // #de1f18

        }
    }
}