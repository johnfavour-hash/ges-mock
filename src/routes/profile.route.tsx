import { Routes, Route } from "react-router"

const ProfileRoutes = () => {
    return (
        <Routes>
            <Route path="/profile" element={<p>Profile</p>} />
            <Route path="/profile/:id/edit" element={<p>Edit Profile</p>} />
        </Routes>
    )
}

export default ProfileRoutes;