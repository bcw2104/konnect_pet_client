import { baseAxios } from "./Axios";

export default serviceApi = {

  login: (payload) => baseAxios.post(`/api/auth/v1/login`, payload),
}