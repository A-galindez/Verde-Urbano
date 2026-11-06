import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  linkText: string;
  icon: LucideIcon;
}

export default function FeatureCard({
  title,
  description,
  href,
  linkText,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h2>

      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>

      <Link
        href={href}
        className="text-emerald-700 font-semibold text-sm hover:underline inline-flex items-center gap-1"
      >
        {linkText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}