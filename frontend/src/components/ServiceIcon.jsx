import { Cake, Gift, Heart, Sparkles, Baby, Flower2, Gem, Briefcase, PartyPopper, Users } from 'lucide-react';

const map = { Cake, Gift, Heart, Sparkles, Baby, Flower2, Gem, Briefcase, PartyPopper, Users };

export default function ServiceIcon({ name, size = 22, ...props }) {
  const Icon = map[name] || Sparkles;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" {...props} />;
}
