import axios from "axios";

const instance = axios.create({
	baseURL: "192.168.10.5:4000"
});

export default instance;