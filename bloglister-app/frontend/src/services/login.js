import axios from 'axios'
const baseUrl = "http://localhost:8080/api/login"

export const login = async credentials => {

    try {
        const response = await axios.post(baseUrl, credentials)
        return response
    } catch (error) {
        return error.response
    }

}
