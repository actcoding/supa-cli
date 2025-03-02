type Args = {
    /**
     * The current index of the overall iteration.
     */
    index: number

    /**
     * The current index of the interpose iteration.
     */
    cursor: number

    /**
     * Whether this is the first interpose.
     */
    first: boolean

    /**
     * Whether this is the last interpose.
     */
    last: boolean
}

/**
 * Interpose items to an array.
 *
 * @param arr The source array to modify.
 * @param producer A function that returns the items to interpose.
 * @returns The interposed array.
 */
export default function interpose<T>(arr: T[], producer: (args: Args) => T) {
    let cursor = 0

    const result = []
    const max = arr.length * 2 - 1

    for (let index = 0; index < max; index++) {
        const first = index == 1
        const last = index === max - 2

        if (index % 2 === 0) {
            result.push(arr[cursor++])
        } else {
            result.push(producer({index, cursor, first, last}))
        }
    }

    return result
}
