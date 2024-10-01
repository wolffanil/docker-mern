import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    :root {
        --violet-color: #cc60ff;

         &.light-mode {
            --backgraund-color: #ffffff;
            --text-color: #212121;
            --grey-color: #f4f4f4;
        }

        &, &.dark-mode {
            --backgraund-color: #212121;
            --text-color: #ffffff;
            --grey-color: #323132;

        }
    }

    *,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  transition: background-color 0.3s, border 0.3s;
}

::-webkit-scrollbar {
  width: 1px;
}

body {
  overflow-x: hidden;
  font-family: "Inter";
  position: relative;
}


body {
  font-family: "Inter", sans-serif;
  color: var(--backgraund-color);

  transition: color 0.3s, background-color 0.3s;
}

html {
  background-color: var(--backgraund-color);
}

canvas {
  touch-action: none;
  width: 100%;
  height: 100%;
  /* min-height: 100dvh; */
  /* height: 179vh; */
}

.htmlScreen iframe {
  width: 1920px;
  height: 670px;
  border: none;
  background: #000000;
  border-radius: 20px;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;

}

input {
  border: none;
}

button {
  cursor: pointer;
  border: none;
  outline: none;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--grey-color);
  color: var(--text-color);
}

input:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--violet-color);
  outline-offset: -1px;
}



a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

@font-face {
  font-family: 'redoctober';
  src: url('/fonts/redoctober.ttf') format('truetype');

  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'montserrat';
  src: url('/fonts/Montserrat-ExtraLight.ttf') format('truetype');

  font-weight: 400;
  font-style: normal;
}

`;

export default GlobalStyles;
