import { useRef, type ReactElement } from "react";

const DetectSwipe = ({
  children,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: ReactElement;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) => {
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  return (
    <div
      onTouchStart={(e) => {
        touchEndRef.current = null;
        if (e.targetTouches[0]) {
          touchStartRef.current = e.targetTouches[0].clientX;
        }
      }}
      onTouchMove={(e) => {
        if (e.targetTouches[0]) {
          touchEndRef.current = e.targetTouches[0].clientX;
        }
      }}
      onTouchEnd={() => {
        const minSwipeDistance = 50;

        if (!touchStartRef.current || !touchEndRef.current) return;
        const distance = touchStartRef.current - touchEndRef.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
          onSwipeLeft();
        } else if (isRightSwipe) {
          onSwipeRight();
        }
      }}
    >
      {children}
    </div>
  );
};

export default DetectSwipe;
