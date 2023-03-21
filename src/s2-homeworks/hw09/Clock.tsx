import React, { useState } from 'react'
import SuperButton from '../hw04/common/c2-SuperButton/SuperButton'
import { restoreState } from '../hw06/localStorage/localStorage'
import s from './Clock.module.css'

function Clock() {
  const [timerId, setTimerId] = useState<number | undefined>(undefined)
  // for autotests // не менять // можно подсунуть в локалСторэдж нужную дату, чтоб увидеть как она отображается
  const [date, setDate] = useState<Date>(new Date(restoreState('hw9-date', Date.now())))
  const [show, setShow] = useState<boolean>(false)

  const start = () => {
    // пишут студенты // запустить часы (должно отображаться реальное время, а не +1)
    // сохранить ид таймера (https://learn.javascript.ru/settimeout-setinterval#setinterval)
    stop()
    const id: number = window.setInterval(() => {
      setDate(new Date())
    }, 1000)
    setTimerId(id)
  }

  const stop = () => {
    // пишут студенты // поставить часы на паузу, обнулить ид таймера (timerId <- undefined)
    clearInterval(timerId)
  }

  const onMouseEnter = () => {
    // пишут студенты // показать дату если наведена мышка
    setShow(true)
  }
  const onMouseLeave = () => {
    // пишут студенты // спрятать дату если мышка не наведена
    setShow(false)
  }

  let finishDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  let finishMonth = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()

  let finishHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  let finishMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  let finishSeconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

  const stringTime = `${finishHours}:${finishMinutes}:${finishSeconds} ` || <br />
  const stringDate = `${finishDate}.${finishMonth}.${date.getFullYear()} ` || <br />

  //   const stringTime = 'date->time' || <br /> // часы24:минуты:секунды (01:02:03)/(23:02:03)/(24:00:00)/(00:00:01) // пишут студенты
  //   const stringDate = 'date->date' || <br /> // день.месяц.год (01.02.2022) // пишут студенты, варианты 01.02.0123/01.02.-123/01.02.12345 не рассматриваем

  // день недели на английском, месяц на английском (https://learn.javascript.ru/intl#intl-datetimeformat)
  const stringDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    new Date(date.getFullYear(), date.getMonth(), date.getDay()),
  ) || <br /> // пишут студенты
  const stringMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(date.getFullYear(), date.getMonth(), date.getDay()),
  ) || <br /> // пишут студенты

  return (
    <div className={s.clock}>
      <div
        id={'hw9-watch'}
        className={s.watch}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span id={'hw9-day'}>{stringDay}</span>,{' '}
        <span id={'hw9-time'}>
          <strong>{stringTime}</strong>
        </span>
      </div>

      <div id={'hw9-more'}>
        <div className={s.more}>
          {show ? (
            <>
              <span id={'hw9-month'}>{stringMonth}</span>, <span id={'hw9-date'}>{stringDate}</span>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </div>
      </div>

      <div className={s.buttonsContainer}>
        <SuperButton
          id={'hw9-button-start'}
          disabled={show} // пишут студенты // задизэйблить если таймер запущен
          onClick={start}
        >
          start
        </SuperButton>
        <SuperButton
          id={'hw9-button-stop'}
          disabled={show} // пишут студенты // задизэйблить если таймер не запущен
          onClick={stop}
        >
          stop
        </SuperButton>
      </div>
    </div>
  )
}

export default Clock
