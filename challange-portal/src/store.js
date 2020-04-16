// store.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  fillColorPeople: '#ff000014',
  lineColorPeople: '#D0EB00',
  lineColorDistance: '#FF0000',
  lineTextColorDistance: '#5CFF00',
  lineWidthDistance: 2,
  lineWidthPeople: 2,
  focalLength: 24,
  line: true,
  people: true,
  scoreThreshold: 0.16,
  distThreshold: 60,
  imageUrl: '',
  data: [],
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'ml-data':
        return { ...state, ...{ data: action.value } };
      case 'iamge-url':
        return { ...state, ...{ imageUrl: action.value } };
      case 'score-threshold':
        return { ...state, ...{ scoreThreshold: action.value } };
      case 'distance-threshold':
        return { ...state, ...{ distThreshold: action.value } };
      case 'people':
        return { ...state, ...{ people: action.value } };
      case 'line':
        return { ...state, ...{ line: action.value } };
      case 'fill-color-people':
        return { ...state, ...{ fillColorPeople: action.value } };
      case 'line-color-people':
        return { ...state, ...{ lineColorPeople: action.value } };
      case 'line-color-distance':
        return { ...state, ...{ lineColorDistance: action.value } };
      case 'line-text-color-distance':
        return { ...state, ...{ lineTextColorDistance: action.value } };
      case 'line-width-distance':
        return { ...state, ...{ lineWidthDistance: action.value } };
      case 'line-width-people':
        return { ...state, ...{ lineWidthPeople: action.value } };
      case 'focal-length':
        return { ...state, ...{ focalLength: action.value } };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
