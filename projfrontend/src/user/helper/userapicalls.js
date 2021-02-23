import { API } from "../../backend";

export const orderDetails = (userId, token) => {
  return fetch(`${API}/user/${userId}/orderlist`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
