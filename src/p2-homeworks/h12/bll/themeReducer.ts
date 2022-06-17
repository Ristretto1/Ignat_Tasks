export type ThemeType = 'dark' | 'red' | 'some'

type InitStateType = {
    theme: ThemeType
}

const initState = {
    theme: 'dark'
} as const;

export const themeReducer = (state: InitStateType = initState, action: changeThemeACType): InitStateType => { // fix any
    switch (action.type) {
        case 'CHANGE-THEME': {
            return {...state, theme: action.newTheme};
        }
        default:
            return state;
    }
};

type changeThemeACType = ReturnType<typeof changeThemeC>

export const changeThemeC = (newTheme: ThemeType): { type: 'CHANGE-THEME', newTheme: ThemeType } => {
    return {
        type: 'CHANGE-THEME',
        newTheme
    } as const
}