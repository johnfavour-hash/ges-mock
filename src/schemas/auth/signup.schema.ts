import { z } from "zod";

const SignupSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormData = z.infer<typeof SignupSchema>;
export default SignupSchema;
export type { SignupFormData };
