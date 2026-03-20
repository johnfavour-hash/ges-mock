import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Image,
  Stack,
  Badge,
} from "@chakra-ui/react";
import useAuthStore from "@stores/auth.store";
import { Button } from "@components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { LogOut, BookOpen, Clock, AlertCircle, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ScoreService } from "@services/score.service";

const DashboardPage = () => {
  const { fullName, clearAuth, id: userId } = useAuthStore();
  const navigate = useNavigate();
  const [existingScore, setExistingScore] = useState<{ score: number, total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      ScoreService.getUserScore(userId)
        .then(setExistingScore)
        .catch(err => console.error("Error fetching score:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login");
  };

  const startExam = () => {
    navigate("/exam");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="brand.navy" color="white" py={{ base: 3, md: 4 }} shadow="md">
        <Container maxW="container.lg">
          <HStack justify="space-between">
            <HStack gap={{ base: 2, md: 4 }}>
              <Image 
                src="/image/fjjffjfjfjfjfj.jpeg" 
                alt="DLCF Logo" 
                h={{ base: "32px", md: "40px" }} 
                w="auto" 
                rounded="md"
                bg="white"
                p={1}
              />
              <Heading size={{ base: "sm", md: "md" }}>DLCF Mock Exam</Heading>
            </HStack>
            <HStack gap={4}>
              <Text fontWeight="medium" display={{ base: "none", md: "block" }}>Welcome, {fullName}</Text>
              <Button
                variant="ghost"
                color="white"
                size="sm"
                onClick={handleLogout}
                _hover={{ bg: "white/10" }}
              >
                <Icon as={LogOut} mr={{ base: 1, md: 2 }} size="sm" /> 
                <Text display={{ base: "none", sm: "block" }}>Logout</Text>
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.md" py={{ base: 6, md: 12 }}>
        <VStack gap={{ base: 6, md: 8 }} align="stretch">
          <Box bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100">
            <VStack gap={6} align="start">
              {existingScore ? (
                <VStack align="start" gap={4} w="full">
                  <Badge colorPalette="green" size="lg">Exam Completed</Badge>
                  <Heading size={{ base: "lg", md: "xl" }} color="brand.navy">Your Result is Ready</Heading>
                  <Box p={6} bg="brand.navy" color="white" rounded="xl" w="full">
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontSize="sm" opacity={0.8}>Final Score</Text>
                        <Heading size="2xl">{existingScore.score} / {existingScore.total}</Heading>
                      </VStack>
                      <Icon as={Award} boxSize="48px" color="brand.orange" />
                    </HStack>
                  </Box>
                  <Text color="gray.600">
                    You have already completed the GES 100 mock exam. Your score has been recorded and sent to the administrator.
                  </Text>
                  <Button variant="outline" w="full" onClick={() => navigate("/result")}>
                    View Detailed Review
                  </Button>
                </VStack>
              ) : (
                <VStack align="start" gap={6} w="full">
                  <VStack align="start" gap={2}>
                    <Heading size={{ base: "lg", md: "xl" }} color="brand.navy">Ready for GES 100?</Heading>
                    <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                      Test your knowledge with our comprehensive mock exam based on past questions and material.
                    </Text>
                  </VStack>

                  <DialogRoot placement="center" motionPreset="slide-in-bottom">
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        bg="brand.orange"
                        color="white"
                        px={8}
                        w={{ base: "full", sm: "auto" }}
                        _hover={{ bg: "brand.orange/90" }}
                        loading={loading}
                      >
                        Start Mock Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle color="brand.navy">Exam Instructions</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        <VStack align="start" gap={4}>
                          <HStack gap={3}>
                            <Icon as={BookOpen} color="brand.orange" />
                            <Text><strong>50 Questions</strong> randomly selected from the bank.</Text>
                          </HStack>
                          <HStack gap={3}>
                            <Icon as={Clock} color="brand.orange" />
                            <Text><strong>30 Minutes</strong> total time limit.</Text>
                          </HStack>
                          <HStack gap={3}>
                            <Icon as={AlertCircle} color="brand.orange" />
                            <Text><strong>No Pause:</strong> The timer continues if you leave the page.</Text>
                          </HStack>
                          <Box p={4} bg="orange.50" rounded="md" w="full" borderLeft="4px solid" borderColor="brand.orange">
                            <Text fontSize="sm" color="orange.800">
                              Ensure you have a stable internet connection before starting. Good luck!
                            </Text>
                          </Box>
                        </VStack>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogActionTrigger>
                        <Button bg="brand.orange" color="white" onClick={startExam}>
                          I'm Ready, Start!
                        </Button>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </DialogContent>
                  </DialogRoot>
                </VStack>
              )}
            </VStack>
          </Box>

          {/* Quick Stats/Info */}
          <Stack direction={{ base: "column", sm: "row" }} gap={4} alignItems="stretch">
            <Box bg="white" p={6} rounded="xl" shadow="sm" flex={1} borderBottom="4px solid" borderColor="brand.navy">
              <VStack align="start" gap={3}>
                <HStack color="brand.navy">
                  <Icon as={BookOpen} size="sm" />
                  <Text fontWeight="bold">Course</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold">GES 100</Text>
                <Text color="gray.500" fontSize="sm">Communication Skills</Text>
              </VStack>
            </Box>
            
            <Box bg="white" p={6} rounded="xl" shadow="sm" flex={1} borderBottom="4px solid" borderColor="brand.orange">
              <VStack align="start" gap={3}>
                <HStack color="brand.orange">
                  <Icon as={Clock} size="sm" />
                  <Text fontWeight="bold">Duration</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold">30 Minutes</Text>
                <Text color="gray.500" fontSize="sm">Time per attempt</Text>
              </VStack>
            </Box>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
