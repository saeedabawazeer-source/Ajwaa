export default function MonsterFace({ mood = 'neutral' }) {
    const isAnimating = mood !== 'neutral';

    return (
        <div className={`monster__face ${isAnimating ? 'animating' : ''}`}>
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
