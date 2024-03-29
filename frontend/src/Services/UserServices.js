import axios from "axios"

export const BACKEND_BASE_URL_2 = "https://pranav1483-intellitask.hf.space/api/"
export const BACKEND_BASE_URL_1 = 'http://localhost:8000/api/'
export const BACKEND_BASE_URL_3 = 'https://intelli-task.onrender.com/api/'

export const BACKEND_BASE_URL = 'https://intelli-task-backend.vercel.app/api/'
class UserService {
    getUser(user) {
        return axios.post(BACKEND_BASE_URL + 'user', user)
    }

    getTasks(user_id) {
        return axios.get(BACKEND_BASE_URL + 'usertasks/' + user_id.toString())
    }

    getTask(id) {
        return axios.get(BACKEND_BASE_URL + 'task/' + id)
    }

    updateTask(id, subtasks, progress) {
        return axios.put(BACKEND_BASE_URL + 'task/update/' + id, {subtask: subtasks, progress: progress})
    }

    deleteTask(id) {
        return axios.delete(BACKEND_BASE_URL + 'task/delete/' + id)
    }

    newTask(id, title, deadline, subtasks, priority, repeat) {
        return axios.post(BACKEND_BASE_URL + 'newtask', {id: id, title: title, deadline: deadline, subtasks: subtasks, priority: priority, repeat: repeat})
    }
}

const userService = new UserService()
export default userService