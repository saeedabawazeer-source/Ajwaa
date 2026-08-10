import { 
    Home, Users, Settings, Trophy, Medal, Check, X, Star, 
    Plus, Minus, CircleDollarSign, Gem, Dumbbell, ArrowRight, ArrowLeft, 
    ArrowUp, ArrowDown, Utensils, Target, Gamepad2, Zap, AlertTriangle, 
    Bot, Camera, Trash2, BarChart2, Scale, Lock 
} from 'lucide-react';

const ICON_MAP = {
    home: Home,
    workout: Dumbbell,
    fist: Dumbbell,
    social: Users,
    profile: Settings,
    trophy: Trophy,
    medal: Medal,
    medal2: Medal,
    check: Check,
    cross: X,
    star: Star,
    plus: Plus,
    minus: Minus,
    coin: CircleDollarSign,
    diamond: Gem,
    gear: Settings,
    arrowRight: ArrowRight,
    arrowLeft: ArrowLeft,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    food: Utensils,
    target: Target,
    gamepad: Gamepad2,
    power: Zap,
    warning: AlertTriangle,
    robot: Bot,
    camera: Camera,
    trash: Trash2,
    leaderboard: BarChart2,
    scale: Scale,
    lock: Lock,
};

export default function KenneyIcon({ name, size = 20, tint = 'black', style = {} }) {
    const Icon = ICON_MAP[name] || Trophy;

    let color = 'var(--c-black)';
    if (tint === 'white') color = '#ffffff';
    else if (tint === 'volt') color = '#E0FF00'; // exact volt hex just to be safe
    else if (tint === 'red') color = '#D62828';
    else if (tint === 'green') color = '#22C55E';

    return (
        <Icon 
            size={size} 
            color={color}
            strokeWidth={2.5}
            style={{ 
                display: 'inline-block',
                verticalAlign: 'middle',
                ...style 
            }} 
        />
    );
}
