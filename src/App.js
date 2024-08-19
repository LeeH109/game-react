import { useEffect, useState } from "react";
import "./output.css";
import "bootstrap/dist/css/bootstrap.min.css";

const conditions = {
  WIN: { text: "ALL CLEARED", color: "green" },
  LOSE: { text: "GAME OVER", color: "red" },
  BEGIN: { text: "LET'S PLAY", color: "black" },
};

function App() {
  const [title, setTitle] = useState(conditions.BEGIN);
  const [titleButton, setTitleButton] = useState(true);
  const [points, setPoints] = useState(0);
  const [nextP, setNextP] = useState(1);
  const [curP, setCurP] = useState(null);

  const [tempPoints, setTempPoints] = useState("");
  const [time, setTime] = useState(0);
  const [list, setList] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const handleClickButton = () => {
    if (tempPoints > 0) {
      setPoints(tempPoints);
      setTime(0);
      setNextP(1);
      setCurP(null);
      setIsActive(true);
      setIsEnd(false);
      setTitleButton(false);
      const newList = [];
      for (let i = 1; i <= tempPoints; i++) {
        newList.push({
          number: i,
          x: Math.random() * 90,
          y: Math.random() * 90,
        });
      }
      setList(newList);
      setTitle(conditions.BEGIN);
    } else {
      handleReset();
    }
  };

  const handleChangePoints = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setTempPoints(value);
    }
  };

  const handleReset = () => {
    setTime(0);
    setTitle(conditions.BEGIN);
    setIsActive(false);
    setList([]);
  };

  const handleClickPoint = (value) => {
    if (value === nextP) {
      setCurP(value);
      setTimeout(() => {
        setList((prevList) => prevList.filter((item) => item.number !== value));
        setNextP((prevNextP) => prevNextP + 1);
        setCurP(null);
      }, 400);
    } else {
      setIsActive(false);
      setIsEnd(true);
      setTitle(conditions.LOSE);
    }
  };

  useEffect(() => {
    if (list.length === 0 && isActive) {
      setIsActive(false);
      setTitle(conditions.WIN);
    }
  }, [list, isActive]);

  return (
    <div className="w-full h-screen">
      <div className="w-2/5 m-auto h-screen shadow">
        <div className="py-12 px-16">
          <h4 className="font-bold pb-2" style={{ color: title.color }}>
            {title.text}
          </h4>
          <div className="flex gap-1 flex-col">
            <div className="flex gap-20">
              <p className="mb-1">Points:</p>
              <input
                value={tempPoints}
                onChange={handleChangePoints}
                type="number"
                className="py-1 max-w-[250px] px-2 block w-full border-1 border-gray-900 rounded-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-11">
              <p>Time:</p>
              <br />
              <p>{time !== 0 ? time.toFixed(1) : "0.0"}s</p>
            </div>
          </div>
          <button
            className="cursor-pointer active:bg-slate-300 min-w-[120px] border-1 bg-slate-100 hover:bg-slate-200 mb-3 text-center items-center rounded-sm font-bold border-black"
            onClick={handleClickButton}
          >
            {titleButton ? "Play" : "Reset"}
          </button>

          <div className="relative border-1 h-[440px] border-black lg:border-l lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none p-2 flex flex-col justify-between leading-normal">
            <div className="relative w-full p-1 h-full">
              {(isActive || isEnd) &&
                list.map((item) => (
                  <p
                    onClick={() => handleClickPoint(item.number)}
                    key={item.number}
                    className="w-10 h-10 border-black border-2 flex font-bold cursor-pointer text-center items-center justify-center rounded-full"
                    style={{
                      position: "absolute",
                      right: `${item.x}%`,
                      top: `${item.y}%`,
                      zIndex: points - item.number + 1,
                      backgroundColor: item.number === curP ? "red" : "white",
                      transition: "background-color 1s ease",
                    }}
                  >
                    {item.number}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
