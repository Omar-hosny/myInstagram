import axios from "axios";

import { GET_ERRORS, AVATAR_LOADING } from "./types";

export const createAvatar = (avatar, history) => dispatch => {
  axios
    .post("/api/avatar", avatar)
    .then(res => history.push("/profile"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getAvatar = () => dispatch => {
  dispatch(setAvatarLoading());
  axios
    .get("/api/avatar")
    .then(res => res.json(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setAvatarLoading = () => {
  return {
    type: AVATAR_LOADING
  };
};
