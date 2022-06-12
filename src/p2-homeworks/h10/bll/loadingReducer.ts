type InitStateType = {
    loading: boolean
}

const initState: InitStateType = {
    loading: false
}

export const loadingReducer = (state = initState, action: loadingACType): InitStateType => { // fix any
    switch (action.type) {
        case 'LOADING': {
            return {...state, loading: action.loading}
        }
        default:
            return state
    }
}

type loadingACType = ReturnType<typeof loadingAC>

export const loadingAC = (loading: boolean): { type: 'LOADING', loading: boolean } => {
    return {
        type: 'LOADING',
        loading
    } as const
}