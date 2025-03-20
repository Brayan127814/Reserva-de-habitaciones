// Funcion para ordenar las reservas de cada cliente logueado

const mergeSortReservations = (reservations) => {
    if (reservations.length <= 1) return reservations


    const mid = Math.floor(reservations.length / 2)
    let left = mergeSortReservations(reservations.slice(0, mid))
    let right = mergeSortReservations(reservations.slice(mid))

    return merge(left, right)
}


const merge = (left, right) => {
    let i = 0
    let j = 0
    let result = []

    while (i < left.length && j < right.length) {
        if (new Date(left[i].checkIn) < new Date(right[j].checkIn)) {
            result.push(left[i])
            i++
        } else {
            result.push(right[j])
            j++
        }

    }

    return result.concat(left.slice(i)).concat(right.slice(j))
}

export default mergeSortReservations