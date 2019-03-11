import axios from "axios";

const instance = axios.create({
	baseURL: "https://automata-generator.firebaseio.com/"
});

export default instance;