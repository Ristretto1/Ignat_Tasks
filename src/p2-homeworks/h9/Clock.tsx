import React, {useState} from 'react'
import SuperButton from '../h4/common/c2-SuperButton/SuperButton'

function Clock() {
    const [timerId, setTimerId] = useState<number>(0)
    const [date, setDate] = useState<Date>(new Date())
    const [show, setShow] = useState<boolean>(false)

    const stop = () => {
       clearInterval(timerId)
    }

    const start = () => {
        stop()
        const id: number = window.setInterval(() => {
            setDate(new Date())
        }, 1000)
        setTimerId(id)
    }

    const onMouseEnter = () => {
        setShow(true)
    }
    const onMouseLeave = () => {
        setShow(false)
    }

    let finishDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    let finishMonth = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()

    let finishHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    let finishMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    let finishSeconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    const stringTime = `${finishHours}:${finishMinutes}:${finishSeconds} `
    const stringDate = `${finishDate}.${finishMonth}.${date.getFullYear()} `

    return (
        <div>
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{margin: '0 15px', border: '1px solid #ccc', width: '70px', textAlign:'center', padding: '2px', verticalAlign: 'middle'}}
            >
                {stringTime}
            </div>

            {show && (
                <div style={{margin: '0 15px', border: '1px solid #ccc', width: '80px', textAlign:'center', padding: '2px', verticalAlign: 'middle'}}
                >
                    {stringDate}
                </div>
            )}

            <SuperButton onClick={start}>start</SuperButton>
            <SuperButton onClick={stop}>stop</SuperButton>

        </div>
    )
}

export default Clock
