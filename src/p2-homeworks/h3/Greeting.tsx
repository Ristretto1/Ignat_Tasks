import React, {ChangeEvent} from 'react'
import s from './Greeting.module.css'
import SuperButton from '../h4/common/c2-SuperButton/SuperButton';
import SuperInputText from '../h4/common/c1-SuperInputText/SuperInputText';

type GreetingPropsType = {
    name: string
    setNameCallback: (e: ChangeEvent<HTMLInputElement>) => void
    addUser: () => void
    error: string
    totalUsers: number
}

// презентационная компонента (для верстальщика)
const Greeting: React.FC<GreetingPropsType> = (
    {name, setNameCallback, addUser, error, totalUsers}) => {
    // const inputClass = error ? s.error : ''

    return (
        <div className={s.inputBlock}>
            <div className={s.inputWrapper}>
                <SuperInputText error={error} value={name} onChange={setNameCallback} />
            </div>
            <SuperButton onClick={addUser}>add</SuperButton>
            <span>{totalUsers}</span>

        </div>
    )
}

export default Greeting
