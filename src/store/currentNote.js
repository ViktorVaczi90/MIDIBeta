// ------------------------------------
// Constants
// ------------------------------------
export const NOTE_CHANGE = 'NOTE_CHANGE'



export function noteChange (note = {}) {
  return {
    type    : NOTE_CHANGE,
    payload : note
  }
}
export const changeCurrentNote = (note) =>{
  return function (dispatch) {
    dispatch(noteChange(note));
  };
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function currentNoteReducer (state = initialState, action) {
  return action.type === NOTE_CHANGE
    ? action.payload
    : state
}
