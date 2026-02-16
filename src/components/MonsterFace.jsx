import React from 'react';
import './MonsterFace.css';

export default function MonsterFace() {
    return (
        <div className="monster__face">
            <div className="monster__eyes">
                <div className="monster__eye"></div>
                <div className="monster__eye"></div>
            </div>
            <div className="monster__mouth">
                <div className="monster__top"></div>
                <div className="monster__bottom"></div>
            </div>
        </div>
    );
}
