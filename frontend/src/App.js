import { BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from "./Components/Landing";
import Dashboard from "./Components/Dashboard";
import TaskDetails from "./Components/TaskDetails";
import AddTask from "./Components/AddTask";

function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Landing/>}/>
                <Route path="/" element={<Landing/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/dashboard/task/:id" element={<TaskDetails/>}/>
                <Route path="/dashboard/task" element={<AddTask/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;