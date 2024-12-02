import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CreateCourse from './pages/createCourse';
import PageEdt from './pages/pageEdt';
import EmailForm from './pages/emailForm';
import PageLogin from './pages/pageLogin';
import PagePasswordChange from './pages/pagePasswordChange';
import ValidationAbsPage from './pages/validateAbsences';
import ProfessorList from './pages/professorPresences';
import CSVExportPage from './pages/exportExample';
import {PrivateRoute} from './routes/privateRoute';
import {AdminPrivateRoute} from './routes/adminRoute';
import {ProfessorPrivateRoute} from './routes/professorRoute';
import {SecretaryPrivateRoute} from './routes/secretaryRoute';
import {StudentPrivateRoute} from './routes/studentRoute';
import {DirectorPrivateRoute} from './routes/directorRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import TestAdmin from './pages/admin/test';
import Unauthorized from './pages/error/Unauthorized';
import NotFound from './pages/error/NotFound';
import Header from "./components/Header"
import PageNotes from './pages/pageNotes';
import PageImportEleves from './pages/pageImportEleves';
import PageCall from './pages/pageCall';
import PageJustify from './pages/pageJustify';
import PageValidate from './pages/pageValidate';
import Users from './pages/users';
import {authService} from './services/authService';
import ForgotPasswordPage from './pages/forgotPassword';

function App() {

    const [listCours, setListCours] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/cours").then((response) => {
            setListCours(response.data)
        })
    }, [])

    const [headerVisibility, setHeaderVisibility] = useState(true);

    let headerRoutes = [
        {title: "Accueil", to: "/"},
    ];

    const currentRole = authService.getCurrentRole();

    // Routes for admins/secretaires
    if (['ROLE_ADMIN', 'ROLE_SUPERADMIN'].includes(currentRole)) {
        headerRoutes.push({title: "Imports", to: '/admin/importStudents'});
        headerRoutes.push({title: "Utilisateurs", to: '/admin/users'})
    }

    if (['ROLE_SECRETARY'].includes(currentRole)) {
        headerRoutes.push({title: "Notes", to: "/secretaire/notes"})
        headerRoutes.push({title: "Absences", to: "/secretaire/validate"})
        headerRoutes.push({title: "Présences", to: "/secretaire/prof-pres"})
        headerRoutes.push({title: "Imports", to: '/secretaire/importStudents'});
        headerRoutes.push({title: "Utilisateurs", to: '/secretaire/users'})
    }

    if (['ROLE_USER'].includes(currentRole)) {
        headerRoutes.push({title: "Notes", to: "/eleve/notes"})
        headerRoutes.push({title: "Absences", to: "/eleve/justify"})
    }

    if (['ROLE_PROFESSOR'].includes(currentRole)) {
        headerRoutes.push({title: "Notes", to: "/enseignant/notes"})
        headerRoutes.push({title: "Absences", to: "/enseignant/validate"})
        headerRoutes.push({title: "Présences", to: "/enseignant/prof-pres"})
        headerRoutes.push({title: "Imports", to: '/secretaire/importStudents'});
        headerRoutes.push({title: "Utilisateurs", to: '/secretaire/users'})
    }

    if (['ROLE_DIRECTOR', 'ROLE_DEPARTMENT_DIRECTOR'].includes(currentRole)) {
        headerRoutes.push({title: "Notes", to: "/directeur/notes"})
        headerRoutes.push({title: "Utilisateurs", to: '/directeur/users'})
        headerRoutes.push({title: "Import", to: '/importStudents'})
    }

    const [userEmail, setUserEmail] = useState();
    const [userRoles, setUserRoles] = useState();
    const [currentWeek, setCurrentWeek] = useState([]);
    const [coursIdForCall, setCoursIdForCall] = useState();

    const handleRoleChange = (event) => {
        const selectedRole = event.target.value;

        // Mettre à jour le local storage avec le nouveau rôle sélectionné
        authService.setCurrentRole(selectedRole);

        authService.setCurrentRoleId(userRoles[selectedRole]);
    };

    useEffect(() => {
        const roles = authService.getUserRoles()
        setUserRoles(roles)

        const currentRole = authService.getCurrentRole()

        const email = authService.getUserEmail()
        setUserEmail(email)
    }, []);

    return (

        <Router>
            <Header currentRole={currentRole} isVisible={headerVisibility} links={headerRoutes}/>
            <Routes>
                <Route exact path='/' element={<PrivateRoute/>}>
                    <Route path="/" element={<PageEdt onStartCall={setCoursIdForCall}
                                                      setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>

                    <Route path="/createcourse"
                           element={<CreateCourse setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                    <Route path="/importStudents"
                           element={<PageImportEleves setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                    <Route path="/users" element={<Users setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                           exact/>

                    <Route exact path='/enseignant/*' element={<ProfessorPrivateRoute/>}>
                        {/* <Route path="callTest" element={<CallForm />} exact /> */}
                        <Route path="call" element={<PageCall coursId={coursIdForCall}
                                                              setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>
                        <Route path="notes" element={<PageNotes setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>
                    </Route>

                    <Route exact path='/directeur/*' element={<DirectorPrivateRoute/>}>
                        <Route path="notes" element={<PageNotes setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>
                        <Route path="users" element={<Users setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>

                    </Route>

                    <Route exact path='/secretaire/*' element={<SecretaryPrivateRoute/>}>
                        <Route path="valid-abs" element={<ValidationAbsPage/>} exact/>
                        <Route path="validate"
                               element={<PageValidate setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                        <Route path="prof-pres"
                               element={<ProfessorList setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                        <Route path="notes" element={<PageNotes setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>

                        <Route path="importStudents"
                               element={<PageImportEleves setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>
                        <Route path="users" element={<Users setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>

                    </Route>

                    <Route exact path='/eleve/*' element={<StudentPrivateRoute/>}>
                        {/* <Route path="justif-abs" element={<JustifyAbsPage />} exact /> */}
                        <Route path="justify"
                               element={<PageJustify setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                        <Route path="notes" element={<PageNotes setHeaderVisibility={() => setHeaderVisibility(true)}/>}
                               exact/>

                    </Route>

                    <Route path="/email" element={<EmailForm/>} exact/>
                    <Route path="/export-csv"
                           element={<CSVExportPage setHeaderVisibility={() => setHeaderVisibility(true)}/>} exact/>
                    {/* <Route path="/email" element={<PageEmail />} exact /> */}

                    <Route path='/admin/*' element={<AdminPrivateRoute/>}>
                        <Route index element={<AdminDashboard setHeaderVisibility={() => setHeaderVisibility(true)}/>}/>
                        <Route path='test' element={<TestAdmin
                            setHeaderVisibility={() => setHeaderVisibility(true)}/>}/>{/* pour une URL de type /admin/test */}
                    </Route>
                </Route>

                {/* -------------- PUBLIC ROUTES -----------------*/}
                <Route path="/login" element={<PageLogin setHeaderVisibility={() => setHeaderVisibility(false)}/>}
                       exact/>
                <Route path="/psw"
                       element={<PagePasswordChange setHeaderVisibility={() => setHeaderVisibility(false)}/>} exact/>
                <Route path="/forgotPassword"
                       element={<ForgotPasswordPage setHeaderVisibility={() => setHeaderVisibility(false)}/>} exact/>
                <Route path='/*' element={<NotFound setHeaderVisibility={() => setHeaderVisibility(false)}/>}/>
                <Route path='/unauthorized'
                       element={<Unauthorized setHeaderVisibility={() => setHeaderVisibility(false)}/>} exact/>

                {/* <Route path="/" element={<ClassSquare height={300} />} exact /> */}
            </Routes>
        </Router>
    );
}

export default App;
