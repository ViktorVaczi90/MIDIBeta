import { combineReducers } from 'redux'
import locationReducer from './location'
import currentNoteReducer from './currentNote'
import currentFreqReducer from './currentFreq'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    currentNote: currentNoteReducer,
    currentFreq: currentFreqReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
