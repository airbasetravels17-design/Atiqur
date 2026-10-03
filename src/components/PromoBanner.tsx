import React, { useState } from 'react';
import { PromoBannerConfig } from '../types/ecommerce';
import { ArrowRight, Sparkles, X, Tag } from 'lucide-react';

interface PromoBannerProps {
  config: PromoBannerConfig;
  onAction?: (view: string, param?: string) => void;
  onDismiss?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  config,
  onAction,
  onDismiss
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (!config.isVisible || isDismissed) {
    return null;
  }

  const bgColor = config.backgroundColor || '#FF3F6C';
  const textColor = config.textColor || '#FFFFFF';

  const handleActionClick = () => {
    if (onAction) {
      onAction(config.linkView || 'shop', config.linkParam || 'sale');
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <aside
      role="banner"
      aria-label="Seasonal Promotion Announcement"
      className="relative z-50 text-[11px] sm:text-xs font-semibold py-2 px-3 sm:px-6 text-center tracking-wide flex items-center justify-center transition-all duration-300 shadow-xs"
      style={{ backgroundColor: bgColor, color: textColor }}
      data-testid="promo-banner"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between sm:justify-center gap-2 relative">
        
        {/* Banner Content & CTA */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-0.5">
          {config.badgeText && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs border border-white/30 text-white shrink-0">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{config.badgeText}</span>
            </span>
          )}

          <span className="font-medium sm:font-semibold text-center leading-tight">
            {config.text}
          </span>

          {config.linkText && (
            <button
              type="button"
              onClick={handleActionClick}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 ml-1 group"
              aria-label={`${config.linkText} - ${config.text}`}
            >
              <span>{config.linkText}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Optional Dismiss button */}
        {config.allowDismiss && (
          <button
            type="button"
            onClick={handleClose}
            className="sm:absolute sm:right-0 p-1 rounded-full hover:bg-black/10 active:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss promotional banner"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </aside>
  );
};
