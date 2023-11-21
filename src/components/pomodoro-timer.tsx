import { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToTime } from '../utils/seconds-to-time';

interface Props {
  PomodoroTime: number;
  ShortRestTime: number;
  LongRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.PomodoroTime);
  const [timecounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(() => {
      setMainTime(mainTime - 1);
      if(working) setFullWorkingTime(fullWorkingTime + 1);
    }, timecounting ? 1000 : null);

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.PomodoroTime);
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    props.PomodoroTime
  ]);

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);
    if (long) {
      setMainTime(props.LongRestTime);
    } else {
      setMainTime(props.ShortRestTime);
    }
  },[
    setTimeCounting,
    setWorking,
    setWorking,
    props.LongRestTime,
    props.ShortRestTime
  ]);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if(mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(false);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if(working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if(resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timecounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timecounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluidos: {completedCycles} </p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)} </p>
        <p>Número de pomodoros concluidos: {numberOfPomodoros} </p>
      </div>

    </div>
  )
}
