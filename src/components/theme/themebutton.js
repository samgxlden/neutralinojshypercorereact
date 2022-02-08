/*
  LICENSE: MIT
  Created by: Lightnet
*/

import React, { useState } from "react"

export default function ThemeButton(){

  const [theme, setTheme] = useState('light');


  function clickToggle(){
    console.log('theme');
    let currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
      targetTheme = "dark";
    }
    setTheme(targetTheme);

    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
  }

  return <button onClick={clickToggle}>
    Theme: {theme}
  </button>
}