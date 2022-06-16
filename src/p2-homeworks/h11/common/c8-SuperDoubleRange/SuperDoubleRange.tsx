import React, {ChangeEvent} from 'react'
import s from './SuperDoubleRange.module.css'

type SuperDoubleRangePropsType = {
    onChangeRange?: (value: [number, number]) => void
    value: [number, number]
    setValue1: (value1: number) => void
    setValue2: (value2: number) => void
    // min, max, step, disable, ...
}

const SuperDoubleRange: React.FC<SuperDoubleRangePropsType> = (
    {
        onChangeRange, value, setValue1, setValue2,
        // min, max, step, disable, ...
    }
) => {
    // сделать самому, можно подключать библиотеки

    const onChangeRangeFirst = (e: ChangeEvent<HTMLInputElement>) => {
        setValue1(+e.currentTarget.value)
    }
    const onChangeRangeSecond = (e: ChangeEvent<HTMLInputElement>) => {
        setValue2(+e.currentTarget.value)
    }

    return (
        <div className={s.rangeBlock}>
            <input value={value[0]} onChange={onChangeRangeFirst} className={s.range} type="range"/>
            <input value={value[1]} onChange={onChangeRangeSecond} className={s.range} type="range"/>
        </div>
    )
}

export default SuperDoubleRange
