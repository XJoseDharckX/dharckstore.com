import React from 'react';
import { Crown, Zap, Target, Gamepad2, AlertCircle } from 'lucide-react';

const iconMap = {
  Crown,
  Zap,
  Target,
  Gamepad2
};

const getIcon = (iconName) => {
  return iconMap[iconName] || AlertCircle;
};

export default getIcon;