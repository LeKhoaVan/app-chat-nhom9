import './PopupQuestion.css'
function PopupNotify({title, mes,onDialog}) {
    return ( 
        <div  onClick={()=>onDialog(true)} className='popup-question'>
            <div onClick={(e)=>e.stopPropagation()} className="popup-question-modal">
                <div className="header">
                    <p>{title}</p>
                </div>
                <div className="body">
                    <p className="title">{mes}</p>
                    <div className='btn-group'>
                        <button onClick={()=>onDialog(true)} className="btn no">OK</button>
                    </div>
                    <div className='clear'></div>
                </div>
            </div>
        </div>
     );
}

export default PopupNotify;