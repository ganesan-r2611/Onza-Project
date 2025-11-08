export function remToVw(rem:number) {
  const remInPx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  console.log(remInPx)
  // const viewportWidth = window.innerWidth;
  const pxValue = rem * remInPx;
  
  return ((pxValue / 1440) * 100) + 'vw';
}