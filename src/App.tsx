import React from 'react';
import './App.css';
import addHabitButton from './images/add.svg'
import logotype from './images/logo.svg'
import commentIcon from './images/comment.svg'
import sportIcon from './images/sport.svg'
import waterIcon from './images/water.svg'
import foodIcon from './images/food.svg'
import closeIcon from './images/close.svg'

function App() {
    return (
        <div className="App">
            <div className="app">
                <div className="panel">
                    <img className="logo" src={logotype} alt="logotype"/>
                    <nav className="menu">
                        <div className="menu__list"></div>
                        <button
                            // onClick="togglePopup()"
                            className="menu__add">
                            <img src={addHabitButton} alt="add item button"/>
                        </button>
                    </nav>
                </div>
                <div className="content">
                    <header>
                        <h1></h1>
                        <div className="progress">
                            <div className="progress__text">
                                <div className="progress__name">Прогресс</div>
                                <div className="progress__percent"></div>
                            </div>
                            <div className="progress__bar">
                                <div className="progress__cover-bar"></div>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className="days"></div>
                        <div className="habbit">
                            <div className="habbit__day input-day">День 1</div>
                            <form
                                className="habbit__form"
                                // onSubmit="addDays(event)"
                            >
                                <input
                                    name="comment"
                                    className="input_icon"
                                    type="text"
                                    placeholder="Комментарий"
                                />
                                <img
                                    className="input__icon"
                                    src={commentIcon}
                                    alt="comment icon"
                                />
                                <button className="habbit__done" type="submit">Готово</button>
                            </form>
                        </div>
                    </main>
                </div>
                <div className="cover cover_hidden">
                    <div className="popup">
                        <h2>Новая привычка</h2>
                        <div className="icon-label">Иконка</div>
                        <div className="icon-select">
                            <button className="icon icon_active"
                                    // onClick="setIcon(this, 'sport')"
                            >
                                <img src={sportIcon} alt="sport"/>
                            </button>
                            <button className="icon"
                                    // onClick="setIcon(this, 'water')"
                            >
                                <img src={waterIcon} alt="water"/>
                            </button>
                            <button className="icon"
                                    // onClick="setIcon(this, 'food')"
                            >
                                <img src={foodIcon} alt="food"/>
                            </button>
                        </div>
                        <form className="popup__form"
                              // onSubmit="addHabbit(event)"
                        >
                            <input type="text" name="name" placeholder="Название"/>
                            <input type="text" name="icon" hidden value="sport"/>
                            <input type="number" name="target" placeholder="Цель"/>
                            <button className="habbit__done" type="submit">Добавить</button>
                        </form>
                        <button className="popup__close">
                            <img
                                // onClick="togglePopup()"
                                src={closeIcon}
                                alt="close button"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
