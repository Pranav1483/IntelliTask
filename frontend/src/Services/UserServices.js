import axios from "axios"

export const BACKEND_BASE_URL_2 = "https://pranav1483-intellitask.hf.space/api/"
export const BACKEND_BASE_URL = 'http://localhost:8000/api/'
export const BACKEND_BASE_URL_3 = 'https://intelli-task.onrender.com/api/'

export const BACKEND_BASE_URL_4 = 'https://intelli-task-backend.vercel.app/api/'
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

    newTask(id, title, deadline, subtasks, priority) {
        return axios.post(BACKEND_BASE_URL + 'newtask', {id: id, title: title, deadline: deadline, subtasks: subtasks, priority: priority})
    }
}

const userService = new UserService()
export default userService