import React from 'react';
import { getExerciseById } from '../data/exerciseDB';
import './ExerciseIllustration.css';

// Verified GIFs from fitnessprogramer.com — only entries we know return 200
const G = (path) => `https://fitnessprogramer.com/wp-content/uploads/${path}.gif`;

const VERIFIED_GIFS = {
    // CHEST
    bench_press: G('2021/02/Barbell-Bench-Press'),
    incline_bench: G('2021/02/Incline-Barbell-Bench-Press'),
    incline_db_press: G('2021/02/Incline-Barbell-Bench-Press'),
    db_fly: G('2021/02/Dumbbell-Fly'),
    cable_flyes: G('2021/02/High-Cable-Crossover'),
    pec_deck: G('2021/02/Pec-Deck-Fly'),
    dips: G('2021/02/Bench-Dips'),
    // BACK
    barbell_row: G('2021/02/Seated-Cable-Row'),
    pull_ups: G('2021/02/Pull-up'),
    lat_pulldown: G('2021/02/Lat-Pulldown'),
    seated_row: G('2021/02/Seated-Cable-Row'),
    face_pull: G('2021/08/Cable-Rear-Pulldown'),
    // SHOULDERS
    ohp: G('2021/02/Barbell-Shoulder-Press'),
    db_shoulder_press: G('2021/02/Dumbbell-Shoulder-Press'),
    push_press: G('2021/10/Dumbbell-Push-Press'),
    lateral_raise: G('2021/02/Dumbbell-Lateral-Raise'),
    // ARMS
    bicep_curl: G('2021/02/Dumbbell-Curl'),
    barbell_curl: G('2021/02/Barbell-Curl'),
    preacher_curl: G('2021/02/Dumbbell-Preacher-Curl'),
    incline_curl: G('2021/02/Concentration-Curl'),
    cable_curl: G('2021/02/Concentration-Curl'),
    tricep_pushdown: G('2021/02/Pushdown'),
    skull_crusher: G('2021/04/One-Arm-Lying-Triceps-Extension'),
    oh_tricep_ext: G('2021/04/Cable-Rope-Overhead-Triceps-Extension'),
    db_kickback: G('2021/02/Dumbbell-Kickback'),
    // LEGS (verified)
    hip_thrust: G('2021/02/Barbell-Hip-Thrust'),
    romanian_dl: G('2021/02/Dumbbell-Romanian-Deadlift'),
    leg_curl: G('2021/02/Leg-Curl'),
    // CORE (verified)
    russian_twist: G('2021/02/Russian-Twist'),
};

const MUSCLE_ICONS = {
    Chest: '💪', Back: '🔙', Shoulders: '🔺', Legs: '🦵', Arms: '💪', Core: '🧘', Cardio: '🏃',
};

export default function ExerciseIllustration({ exerciseId, size = 100 }) {
    const ex = getExerciseById(exerciseId);
    const src = VERIFIED_GIFS[exerciseId];
    // If we have a verified GIF, show it
    if (src) {
        return (
            <div className="ex-ill-wrap" style={{ width: size, height: size }}>
                <img src={src} alt={ex?.name || 'exercise'} className="ex-ill-img" loading="lazy" />
            </div>
        );
    }
    // Otherwise show a neutral muscle-group card
    const muscle = ex?.muscle || 'General';
    const icon = MUSCLE_ICONS[muscle] || '🏋️';
    return (
        <div className="ex-ill-wrap ex-ill-placeholder" style={{ width: size, height: size }}>
            <div className="ex-ill-fallback">
                <span className="ex-ill-fallback-icon">{icon}</span>
                <span className="ex-ill-fallback-label">{muscle}</span>
            </div>
        </div>
    );
}