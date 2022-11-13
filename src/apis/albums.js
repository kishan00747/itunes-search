import Axios from "axios";
import { URL_TOP_100_ALBUMS } from "../constants/urls";

export const getAlbums = (url = URL_TOP_100_ALBUMS) => {
  return Axios.get(url).then((res) => res.data);
};
