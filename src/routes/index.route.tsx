import { Route, Routes, BrowserRouter } from "react-router";
import { lazy } from "react";
import RootLayout from "@app/layouts/layout";
import AuthGuard from "@components/shared/AuthGuard";

const DashboardPage = lazy(() => import("../app/pages/dashboard/page"));
const ExamPage = lazy(() => import("../app/pages/exam/page"));
const ResultPage = lazy(() => import("../app/pages/result/page"));
const SignupPage = lazy(() => import("@pages/auth/signup/page"));
const LoginPage = lazy(() => import("@pages/auth/login/page"));
const AdminDashboardPage = lazy(() => import("@pages/admin/dashboard/page"));

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* auth routes */}
                <Route element={<RootLayout />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/signup" element={<SignupPage />} />
                    <Route path="/auth/forgot-password" element={<p>Forgot Password</p>} />
                </Route>

                {/* protected routes */}
                <Route element={<AuthGuard />}>
                    <Route element={<RootLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/exam" element={<ExamPage />} />
                        <Route path="/result" element={<ResultPage />} />
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/profile" element={<p>Profile</p>} />
                        <Route path="/profile/:id/edit" element={<p>Edit Profile</p>} />
                    </Route>
                </Route>

                <Route element={<RootLayout />}>
                    <Route path="/about" element={<p>About</p>} />
                    <Route path="/contact" element={<p>Login</p>} />
                </Route>
            </Routes>
        </BrowserRouter >
    )
}

export default Router;