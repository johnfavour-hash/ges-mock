import { Flex, Heading, Text, VStack, Input, Image } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthService } from "@services/auth.service";
import useAuthStore from "@stores/auth.store";
import { useNavigate, Link } from "react-router";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { useState } from "react";
import { toaster } from "@components/ui/toaster";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("LoginPage: Submitting login data...", data.email);
    setLoading(true);
    try {
      const response = await AuthService.login(data);
      console.log("LoginPage: Success!", response);
      setAuth(response);
      toaster.create({
        title: "Login Successful",
        description: `Welcome back, ${response.fullName}!`,
        type: "success",
      });
      
      if (response.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Something went wrong";
      toaster.create({
        title: "Login Failed",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <VStack 
        gap={8} 
        w="full" 
        maxW="md" 
        p={{ base: 6, md: 10 }} 
        bg="white" 
        rounded="2xl" 
        shadow="xl" 
        borderTop="8px solid" 
        borderColor="brand.navy"
      >
        <VStack gap={4} textAlign="center">
          <Image 
            src="/image/fjjffjfjfjfjfj.jpeg" 
            alt="DLCF Logo" 
            h={{ base: "60px", md: "80px" }} 
            w="auto" 
            objectFit="contain"
          />
          <VStack gap={1}>
            <Heading color="brand.navy" size={{ base: "lg", md: "xl" }}>DLCF GES 100</Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>Login to start your mock exam</Text>
          </VStack>
        </VStack>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack gap={4}>
            <Field label="Email Address" invalid={!!errors.email} errorText={errors.email?.message}>
              <Input {...register("email")} placeholder="yourname@example.com" />
            </Field>

            <Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
              <Input {...register("password")} type="password" placeholder="••••••••" />
            </Field>

            <Button
              type="submit"
              loading={loading}
              bg="brand.orange"
              color="white"
              w="full"
              _hover={{ bg: "brand.orange/90" }}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Text color="gray.600">
          Don't have an account?{" "}
          <Link to="/auth/signup" style={{ color: "#F47920", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </Text>
      </VStack>
    </Flex>
  );
};

export default LoginPage;
