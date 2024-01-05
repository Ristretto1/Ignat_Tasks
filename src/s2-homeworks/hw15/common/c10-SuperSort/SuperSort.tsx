import React from 'react'
import iconDown from "../../assets/down.svg"
import iconUp from "../../assets/up.svg"
import iconNone from "../../assets/none.png"


// добавить в проект иконки и импортировать
const downIcon = iconDown
const upIcon = iconUp
const noneIcon = iconNone

export type SuperSortPropsType = {
    id?: string
    sort: string
    value: string
    onChange: (newSort: string) => void
}

export const pureChange = (sort: string, down: string, up: string) => {
    if (sort==='')return down
    if (sort===down)return up
    if (sort===up)return ''
    return down
}

const SuperSort: React.FC<SuperSortPropsType> = (
    {
        sort, value, onChange, id = 'hw15',
    }
) => {
    const up = '0' + value
    const down = '1' + value

    const onChangeCallback = () => {
        onChange(pureChange(sort, down, up))
    }

    const icon = sort === down
        ? downIcon
        : sort === up
            ? upIcon
            : noneIcon

    return <span
        id={id + '-sort-' + value}
        onClick={onChangeCallback}
    >

            <img
                style={{width: "20px", height: "20px"}}
                id={id + '-icon-' + sort}
                src={icon}
            />

        </span>

}

export default SuperSort
