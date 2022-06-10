import {UserType} from '../HW8';

type ActionType = {
    type: 'sort'
    payload: 'up' | 'down'
} | {
    type: 'check'
    payload: number
}

export const homeWorkReducer = (state: Array<UserType>, action: ActionType): Array<UserType> => { // need to fix any
    switch (action.type) {
        case 'sort': {
            switch(action.payload) {
                case 'down':
                    return [...state].sort((a, b) => b.age - a.age)
                case 'up':
                    return [...state].sort((a, b) => a.age - b.age)
                default: return state
            }
        }

        case 'check': {
            return [...state].filter(p => action.payload < p.age)
        }
        default:
            return state
    }
}