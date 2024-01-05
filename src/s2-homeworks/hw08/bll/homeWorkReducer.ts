import {UserType} from '../HW8'

type ActionType =
    | { type: 'sort'; payload: 'up' | 'down' }
    | { type: 'check'; payload: number }

export const homeWorkReducer = (state: UserType[], action: ActionType): any => { // need to fix any
    switch (action.type) {

        case 'sort': {
            // by name
            const stateCopy = [...state]
            const changedCopy = stateCopy.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1
                }
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1
                }
                return 0

            })
            return action.payload === "up" ? changedCopy : changedCopy.reverse() // need to fix
        }
        case 'check': {
            return action.payload === 18 ? [...state].filter(i => i.age >= 18) : state// need to fix
        }
        default:
            return state
    }
}
