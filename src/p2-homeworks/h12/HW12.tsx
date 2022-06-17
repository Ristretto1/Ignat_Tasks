import React, {useState} from 'react';
import s from './HW12.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {AppStoreType} from '../h10/bll/store';
import {changeThemeC, ThemeType} from './bll/themeReducer';
import SuperRadio from '../h7/common/c6-SuperRadio/SuperRadio';

const themes = ['dark', 'red', 'some'];

function HW12() {
    const theme = useSelector<AppStoreType, ThemeType>(state => state.color.theme); // useSelector
    const dispatch = useDispatch();

    const onChangeOption = (theme: ThemeType) => dispatch(changeThemeC(theme))


    return (
        <div className={s[theme]}>
            <hr/>
            <span className={s[theme + '-text']}>
                homeworks 12
            </span>

            <SuperRadio
                name={'theme'}
                options={themes}
                onChangeOption={onChangeOption}
                value={theme}
            />
            {/*should work (должно работать)*/}
            {/*SuperSelect or SuperRadio*/}

            <hr/>
        </div>
    );
}

export default HW12;
