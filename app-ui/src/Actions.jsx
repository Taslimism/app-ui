import React from 'react';
import style from './Actions.module.css';

const Actions = (props) => {

    return <div className={style["action-container"]}>
        <button onClick={() => { props.createHandler() }} className={style["addLink"]}>Create Link</button>
        <button onClick={() => { props.deleteHandler() }} className={style["deleteLink"]}>Delete Link</button>
    </div>

}

export default Actions;