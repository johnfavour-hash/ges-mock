import { AuthService } from "@services/auth.service"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { LoginData, LoginResponse, SignupData, SignupResponse } from "@type/auth.type"


// auth hook
export const AuthHook = {
    useLogin: (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
        mutationFn: (payload: LoginData) => AuthService.login(payload),
        ...options
    }),
    useSignup: (options?: UseMutationOptions<SignupResponse, Error, SignupData, unknown>) => useMutation<SignupResponse, Error, SignupData, unknown>({
        mutationFn: (payload: SignupData) => AuthService.signup(payload),
        ...options
    }),
    // ... other auth hooks here
}