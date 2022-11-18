import './PopupQuestion.css'
function PopupQuestionOutGroup({title, mes,onDialog}) {
    return ( 
        <div  onClick={()=>onDialog(false)} className='popup-question'>
            <div onClick={(e)=>e.stopPropagation()} className="popup-question-modal">
                <div className="header">
                    <p>{title}</p>
                    <p className='icon' onClick={()=>onDialog(false)}>&times;</p>
                </div>
                <div className="body">
                    <p className="title">{mes}</p>
                    <div className='btn-group'>
                        <button onClick={()=>onDialog(false)} className="btn no">Không</button>
                        <button  onClick={()=>onDialog(true)} className="btn yes">{title}</button>
                    </div>
                    <div className='clear'></div>
                </div>
            </div>
        </div>
     );
}

export default PopupQuestionOutGroup;