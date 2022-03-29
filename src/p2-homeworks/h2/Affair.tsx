import React from 'react'
import {AffairType} from './HW2';
import s from './Affair.module.css'
import SuperButton from '../h4/common/c2-SuperButton/SuperButton';

type AffairPropsType = {
    // key не нужно типизировать
    affair: AffairType
    deleteAffairCallback: (value: number) => void
}

function Affair(props: AffairPropsType) {
    const deleteCallback = () => props.deleteAffairCallback(props.affair._id)

    return (
        <div className={s.affairItem}>
            <span>{props.affair.name}</span>
            <span>{props.affair.priority}</span>
            <SuperButton red onClick={deleteCallback}>X</SuperButton>
        </div>
    )
}

export default Affair