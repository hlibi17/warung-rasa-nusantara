import { useEffect, useRef } from 'react';
import { drawFoodSprite } from '../game/pixelArt';
import { DEFAULT_SERVING_OPTIONS } from '../game/rules';
import { CookingStatus, MenuItemId } from '../game/types';

interface PixelSpriteProps {
  itemId: MenuItemId;
  size?: number;
  className?: string;
  cookingPhase?: CookingStatus;
}

export function PixelSprite({
  itemId,
  size = 48,
  className = '',
  cookingPhase,
}: PixelSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = canvas.width / 16;
    drawFoodSprite(
      ctx,
      itemId,
      0,
      0,
      scale,
      DEFAULT_SERVING_OPTIONS,
      cookingPhase
    );
  }, [itemId, size, cookingPhase]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  );
}
