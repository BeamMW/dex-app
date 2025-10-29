import { css } from '@linaria/core';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
css`
  :global() {
    :root {
      --color-purple: #da68f5;
      --color-red: #f25f5b;
      --color-red-expiring: #ff436a;
      --color-yellow: #f4ce4a;
      --color-green: #00f6d2;
      --color-blue: #0bccf7;
      --color-dark-blue: #042548;
      --color-darkest-blue: #032e49;
      --color-white: #ffffff;
      --color-gray: #8196a4;
      //--color-white: white;
      --color-disabled: #8da1ad;
      --color-select-list: rgba(0, 0, 0, 0.8);
      --color-opasity-0-1: rgba(255, 255, 255, 0.1);
      @media (max-width: 480px) {
        #btn_install {
       margin-left: 0 !important;
          margin-top: 10px;
        }
      }
    }

    * {
      box-sizing: border-box;
      outline: none;
    }
    @font-face {
      font-family: 'ProximaNova';
      src: url('../assets/fonts/ProximaNova-Regular.woff2') format('woff2'),
      url('../assets/fonts/ProximaNova-Regular.woff') format('woff'),
      url('../assets/fonts/ProximaNova-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('../assets/fonts/ProximaNova-RegularIt.woff2') format('woff2'),
      url('../assets/fonts/ProximaNova-RegularIt.woff') format('woff'),
      url('../assets/fonts/ProximaNova-RegularIt.ttf') format('truetype');
      font-weight: normal;
      font-style: italic;
      font-display: swap;
    }

    @font-face {
      src: url('../assets/fonts/ProximaNova-Semibold.woff2') format('woff2'),
      url('../assets/fonts/ProximaNova-Semibold.woff') format('woff'),
      url('../assets/fonts/ProximaNova-Semibold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('../assets/fonts/ProximaNova-Bold.woff2') format('woff2'),
      url('../assets/fonts/ProximaNova-Bold.woff') format('woff'),
      url('../assets/fonts/ProximaNova-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('../assets/fonts/SFProDisplay-Regular.woff2') format('woff2'),
      url('../assets/fonts/SFProDisplay-Regular.woff') format('woff'),
      url('../assets/fonts/SFProDisplay-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('../assets/fonts/SFUIDisplay-Medium.woff2') format('woff2'),
      url('../assets/fonts/SFUIDisplay-Medium.woff') format('woff'),
      url('../assets/fonts/SFUIDisplay-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('../assets/fonts/SFProDisplay-Bold.woff2') format('woff2'),
      url('../assets/fonts/SFProDisplay-Bold.woff') format('woff'),
      url('../assets/fonts/SFProDisplay-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
      min-width: 375px;
      font-family: 'ProximaNova', 'SFProDisplay', sans-serif;
      font-weight: 600;
    }

    #root {
      display: inline;
    }

    body {
      font-size: 14px;
      color: white;
    }

    p {
      margin: 0;
    }

    h1,
    h2 {
      margin: 0;
    }

    ul,
    ol :not(.description) {
      margin: 0;
      padding: 0;
    }

    tr,
    th,
    table {
      border: none;
      border-spacing: 0;
      padding: 0;
      margin: 0;
      border-collapse: inherit;
    }
  }
  }
`;
