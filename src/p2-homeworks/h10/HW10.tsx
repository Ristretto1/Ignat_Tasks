import React from 'react'
import SuperButton from '../h4/common/c2-SuperButton/SuperButton'
import {useDispatch, useSelector} from 'react-redux';
import {AppStoreType} from './bll/store';
import {loadingAC} from './bll/loadingReducer';
import {Preloader} from './Preloader';

function HW10() {

    const loading = useSelector<AppStoreType, boolean>(state => state.loading.loading)
    const dispatch = useDispatch();

    const setLoading = () => {
        // dispatch
        // setTimeout

        dispatch(loadingAC(true))
        console.log('loading...')

        setTimeout(() => {
            dispatch(loadingAC(false))
        }, 2000)

    };

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <hr/>
                homeworks 10

                {/*should work (должно работать)*/}
                {loading
                    ? (
                        <div><Preloader/></div>
                    ) : (
                        <div>
                            <SuperButton onClick={setLoading}>set loading...</SuperButton>
                        </div>
                    )
                }


            </div>
            <hr/>
            {/*для личного творчества, могу проверить*/}
            {/*<Alternative/>*/}
            <hr/>
        </>

    )
}

export default HW10
