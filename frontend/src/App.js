import { BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from "./Components/Landing";
import Dashboard from "./Components/Dashboard";
import TaskDetails from "./Components/TaskDetails";
import AddTask from "./Components/AddTask";
import Activity from "./Components/Activity";
import Reports from "./Components/Reports";

function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Landing/>}/>
                <Route path="/" element={<Landing/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/dashboard/task/:id" element={<TaskDetails/>}/>
                <Route path="/dashboard/task" element={<AddTask/>}/>
                <Route path="/activity" element={<Activity/>}/>
                <Route path="/reports" element={<Reports/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;