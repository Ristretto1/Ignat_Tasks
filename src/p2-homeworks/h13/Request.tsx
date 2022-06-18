import React, {ChangeEvent, useState} from 'react';
import {API} from './API';
import SuperCheckbox from '../h4/common/c3-SuperCheckbox/SuperCheckbox';
import SuperButton from '../h4/common/c2-SuperButton/SuperButton';

export const Request = () => {


    const [status, setStatus] = useState<boolean>(true)
    const [answer, setAnswer] = useState<string>('')


    const onClickHandler = () => {
        API.setStatus(status)
            .then(response => {
                setAnswer(response.data.errorText)
            })
            .catch(error => {
                setAnswer(error.response.data.errorText)
            })
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.checked)
    }
    return (
        <div>
            <div>{answer}</div>
            <SuperCheckbox checked={status} onChange={onChangeHandler}/>
            <SuperButton onClick={onClickHandler}>Send</SuperButton>
        </div>
    );
};

