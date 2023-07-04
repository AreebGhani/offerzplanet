import axios from "axios";
import React from "react";
import { Timer } from "./Timer";

const CountDown = ({ data }) => {

  const { components, length } = Timer({data});

  return (
    <div>
      {length ? (
        <div>
          {components}
        </div>
      ) : (
        <span style={{color: "red", fontSize: "25px"}}>Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
