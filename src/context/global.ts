import React from 'react';

const GlobalContext = React.createContext(({} as any as {
  changeTheme: (val: 'darkAlgorithm' | 'defaultAlgorithm') => void,
  themeData:string
}));

export default GlobalContext;