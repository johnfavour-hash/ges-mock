import { useForm } from "react-hook-form";
import type { SignupFormData } from "@schemas/auth/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import signupSchema from "@schemas/auth/signup.schema";

const useSignupForm = () => {
    return useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
}

export default useSignupForm;