import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ msg, type = 'success' }) {
    // Auto-dismiss handled by parent usually, but simple fade in/out here
    return (
        <div className={`toast toast-${type}`}>
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{msg}</span>
        </div>
    );
}
