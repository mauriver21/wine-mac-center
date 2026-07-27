import { useTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Code as BaseCode, CodeProps as BaseCodeProps } from 'reactjs-shared-ui/syntax-highlighter';

export type CodeProps = BaseCodeProps;

export const Code: React.FC<CodeProps> = (props) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToEndRef = useRef(true);
  const hasOverflowRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number | undefined;
    const scrollToEnd = () => {
      if (animationFrame !== undefined) return;

      animationFrame = requestAnimationFrame(() => {
        animationFrame = undefined;
        const scrollContainer = container.querySelector('pre');
        if (!scrollContainer) return;

        const hasOverflow = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        const overflowAppeared = hasOverflow && !hasOverflowRef.current;
        hasOverflowRef.current = hasOverflow;

        if (shouldScrollToEndRef.current || overflowAppeared) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          shouldScrollToEndRef.current = true;
        }
      });
    };
    const observer = new MutationObserver(scrollToEnd);
    const resizeObserver = new ResizeObserver(scrollToEnd);

    observer.observe(container, { childList: true, characterData: true, subtree: true });
    resizeObserver.observe(container);
    scrollToEnd();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = event.target;
    if (!(scrollContainer instanceof HTMLPreElement)) return;

    const distanceFromEnd =
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
    shouldScrollToEndRef.current = distanceFromEnd <= 1;
  };

  return (
    <div ref={containerRef} onScrollCapture={handleScroll}>
      <BaseCode
        sx={{
          border: `1px solid ${theme.palette.secondary.dark}`,
          '& > pre': {
            minHeight: 40,
            maxHeight: 200,
            overflowY: 'auto',
            overflowX: 'hidden !important'
          }
        }}
        language="bash"
        {...props}
      />
    </div>
  );
};
