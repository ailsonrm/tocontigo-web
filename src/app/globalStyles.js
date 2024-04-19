import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

* {
  box-sizing: border-box;
  margin: 0px;
}

.custom-tooltip-inner .tooltip-inner {
  max-width: fit-content;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}


body {
  font-family: 'Nunito', sans-serif;
  color: #475f7b !important;
  background: #f2f4f4 !important;
  min-height: 100vh;
}

.cap {
  text-transform: capitalize;
}

.breadcrumbs {
  margin: 20px 0 25px 0;
}
.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 14px;

  .emoji {
    font-size: 40px;
    margin-right: 15px;
  }
  .page-title {
    margin: 0;
  }
}

#overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .modalBox {
    background: white;
    max-width: 350px;
    width: 90%;
    border-radius: 5px;
    padding: 15px;

    .title {
      font-size: 18px;
      // font-weight: bold;
      margin: 0;

      i {
        transform: translate(-2px, 1px);
      }
    }
    .message {
      margin: 15px 0;
    }
    .actions {
      display: flex;
      justify-content: space-between;
    }
  }
}
`;
