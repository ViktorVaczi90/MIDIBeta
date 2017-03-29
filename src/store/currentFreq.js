// ------------------------------------
// Constants
// ------------------------------------
export const FREQ_CHANGE = 'FREQ_CHANGE'



export function freqChange (freq = 0) {
  return {
    type    : FREQ_CHANGE,
    payload : freq
  }
}
export const changeCurrentFreq = (freq) =>{
  console.log({freq})
  return function (dispatch) {
    dispatch(freqChange(freq));
  };
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function currentFreqReducer (state = initialState, action) {
  return action.type === FREQ_CHANGE
    ? action.payload
    : state
}
