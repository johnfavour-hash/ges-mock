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
import SignupSchema from "@schemas/auth/signup.schema";

type SignupForm = z.infer<typeof SignupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    console.log("SignupPage: Submitting form data...", data);
    setLoading(true);
    try {
      const response = await AuthService.signup(data);
      console.log("SignupPage: Success!", response);
      setAuth(response);
      toaster.create({
        title: "Account Created",
        description: `Welcome, ${response.fullName}!`,
        type: "success",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Full Signup Error:", error.response?.data);
      const data = error.response?.data;
      const errorMessage = (typeof data?.error === 'string' ? data.error : (data?.message || data?.details)) || error.message || "Something went wrong";
      const details = data?.missing_fields ? `Missing: ${data.missing_fields.join(", ")}` : "";
      
      toaster.create({
        title: "Signup Failed",
        description: `${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)} ${details}`,
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
            <Heading color="brand.navy" size={{ base: "lg", md: "xl" }}>Join DLCF GES 100</Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>Create an account to track your progress</Text>
          </VStack>
        </VStack>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack gap={4}>
            <Field label="Full Name" invalid={!!errors.fullName} errorText={errors.fullName?.message}>
              <Input {...register("fullName")} placeholder="John Doe" />
            </Field>

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
              Sign Up
            </Button>
          </VStack>
        </form>

        <Text color="gray.600">
          Already have an account?{" "}
          <Link to="/auth/login" style={{ color: "#F47920", fontWeight: "bold" }}>
            Login
          </Link>
        </Text>
      </VStack>
    </Flex>
  );
};

export default SignupPage;
