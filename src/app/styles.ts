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
    html {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overscroll-behavior: none;
    }

    body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      min-width: 0;
      overflow-x: hidden;
      overscroll-behavior: none;
      touch-action: pan-y pinch-zoom;
      font-family: 'ProximaNova', 'SFProDisplay', sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: white;
    }

    /* Same shell as Window (Utils.isWeb() || Utils.isMobile()); fills viewport behind TopNav */
    body.web,
    body.mobile {
      background-color: var(--color-dark-blue);
      min-height: 100vh;
    }

    html:has(body.web),
    html:has(body.mobile) {
      background-color: var(--color-dark-blue);
    }

    #root {
      display: block;
      height: 100%;
      min-height: 100%;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
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
