import React from 'react';

export default (props) => {
    return (
        <>
            <h1 className="text-center">Please select the difficulty</h1>
            <div className="row align-items-center h-100">
                <div className="col text-center">
                    <button type="button" onClick={e => props.onSelect('easy')} className="btn btn-primary btn-lg">Easy</button>
                </div>
                <div className="col text-center">
                    <button type="button" onClick={e => props.onSelect('medium')} className="btn btn-primary btn-lg">Medium</button>
                </div>
                <div className="col text-center">
                    <button type="button" onClick={e => props.onSelect('hard')} className="btn btn-primary btn-lg">Hard</button>
                </div>
            </div>
        </>
    )
}