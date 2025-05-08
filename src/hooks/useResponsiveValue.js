export const useResponsiveValue = (
  mobileValue,
  desktopValue,
  mobileBreakpoint = 768,
  desktopBreakpoint = 1024
) => {
  const width = window.innerWidth;

  if (width <= mobileBreakpoint) return mobileValue;
  if (width >= desktopBreakpoint) return desktopValue;

  const t = (width - mobileBreakpoint) / (desktopBreakpoint - mobileBreakpoint);
  return mobileValue + t * (desktopValue - mobileValue);
};
