import './index.css';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="Container">
      <PomodoroTimer
        PomodoroTime={3600}
        ShortRestTime={2}
        LongRestTime ={5}
        cycles={4}
      />
    </div>
  );
}

export default App;
