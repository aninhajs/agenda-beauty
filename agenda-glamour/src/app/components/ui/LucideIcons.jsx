import React from "react";
import {
  Calendar,
  Crown,
  Briefcase,
  Scissors,
  Users,
  Clock,
  Trash2,
  Shield,
  TrendingUp,
  Diamond,
  DollarSign,
  Mail,
  Phone,
  Edit2,
  Tag,
  AlertCircle,
  Menu,
} from "lucide-react";

const iconMap = {
  calendar: Calendar,
  crown: Crown,
  briefcase: Briefcase,
  scissors: Scissors,
  users: Users,
  clock: Clock,
  trash: Trash2,
  shield: Shield,
  analytics: TrendingUp,
  diamond: Diamond,
  dollar: DollarSign,
  mail: Mail,
  phone: Phone,
  edit: Edit2,
  tag: Tag,
  alert: AlertCircle,
  menu: Menu,
};

const LucideIcon = ({ name, size = 24, className = "", ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide Icons`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default LucideIcon;
