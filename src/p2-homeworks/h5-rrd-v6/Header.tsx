import React, {useState} from 'react'
import {NavLink} from 'react-router-dom';
import {PATH} from './Pages';
import s from './Header.module.css';
import SuperButton from '../h4/common/c2-SuperButton/SuperButton';


function Header() {

    const [menuFlag, setMenuFlag] = useState<boolean>(true)

    const onClickMenuHandler = () => setMenuFlag(!menuFlag)


    return (
        <div>
            <ul className={s.menuList}>
                <li className={menuFlag ? s.hidden : ''}>
                    <NavLink to={PATH.PRE_JUNIOR}>Pre-Junior</NavLink>
                </li>
                <li className={menuFlag ? s.hidden : ''}>
                    <NavLink to={PATH.JUNIOR}>Junior</NavLink>
                </li>
                <li className={menuFlag ? s.hidden : ''}>
                    <NavLink to={PATH.JUNIOR_PLUS}>Junior-Plus</NavLink>
                </li>
                <li>
                    <SuperButton onClick={onClickMenuHandler}>Menu</SuperButton>
                </li>
            </ul>
        </div>
    )
}

export default Header
