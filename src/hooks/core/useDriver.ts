import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';

export function useStepsDriver(steps: Driver.Step[]) {
  const driver = new Driver({
    doneBtnText: '完成', // Text on the final button
    closeBtnText: '关闭', // Text on the close button for this step
    stageBackground: 'rgba(255, 255, 255,0.4)', // Background color for the staged behind highlighted element
    nextBtnText: '下一步', // Next button text for this step
    prevBtnText: '上一步', // Previous button text for this step
  });

  function startDriver(e: Event) {
    e.stopPropagation();
    driver.defineSteps(steps);
    driver.start();
  }
  return { startDriver };
}
